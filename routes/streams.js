const express = require("express");
const router = express.Router();
const { Readable } = require("stream");
const { findUser } = require("../data/users");
const { liveStreams } = require("../data/live");
const { vodStreams } = require("../data/movies");
const { series } = require("../data/series");

// Xtream stream URLs follow this convention:
//   /live/{username}/{password}/{stream_id}.{ext}
//   /movie/{username}/{password}/{stream_id}.{ext}
//   /series/{username}/{password}/{episode_id}.{ext}
// Auth is embedded in the path (not query params) for these.

function checkAuth(username, password) {
  const user = findUser(username, password);
  if (!user) return { ok: false, code: 401, reason: "invalid credentials" };
  if (user.status === "Disabled") return { ok: false, code: 403, reason: "account disabled" };
  const now = Math.floor(Date.now() / 1000);
  if (user.exp_date !== null && Number(user.exp_date) < now) {
    return { ok: false, code: 403, reason: "subscription expired" };
  }
  return { ok: true, user };
}

function parseStreamId(param) {
  return Number(String(param).split(".")[0]);
}

function isHls(sourceUrl) {
  return sourceUrl.includes(".m3u8");
}

const PROXY_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "*/*",
};

// Proxies a DIRECT FILE (mp4, etc.) through our server instead of a 302
// redirect. This is safe for single-file media because there's nothing to
// break: the whole response is one binary stream, so serving it via our own
// domain doesn't change how the client interprets it. Useful because some
// origins apply hotlink/bot-detection to requests that look like they're
// coming from a media player or a datacenter IP (this is what broke
// Google's sample bucket for us) - a server-to-server fetch with
// browser-like headers avoids the cheapest version of that.
//
// IMPORTANT: this must NEVER be used for .m3u8 (HLS) sources. An HLS
// manifest lists its own segment/variant URLs as paths *relative to
// whatever URL the client fetched the manifest from*. If we proxy the
// manifest through our own domain, the client resolves those relative
// paths against OUR server instead of the real origin, and every segment
// request 404s - the manifest loads but nothing ever plays. This was the
// actual bug behind "none of the multi-audio/subtitle VODs work": every
// item in that category was HLS and was being proxied. HLS sources use
// redirectStream instead - see below.
async function proxyStream(sourceUrl, req, res) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const headers = { ...PROXY_HEADERS };
    if (req.headers.range) headers.range = req.headers.range;

    const upstream = await fetch(sourceUrl, {
      headers,
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!upstream.ok && upstream.status !== 206) {
      console.error(`[proxy] upstream ${upstream.status} for ${sourceUrl}`);
      return res.status(502).json({
        error: "upstream source returned a bad status",
        upstream_status: upstream.status,
        source: sourceUrl,
      });
    }

    res.status(upstream.status);
    ["content-type", "content-length", "content-range", "accept-ranges"].forEach((h) => {
      const v = upstream.headers.get(h);
      if (v) res.setHeader(h, v);
    });

    if (!upstream.body) return res.end();
    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    clearTimeout(timeout);
    console.error(`[proxy] failed to reach ${sourceUrl}:`, err && err.message);
    res.status(502).json({
      error: "failed to reach upstream source",
      detail: String(err && err.message ? err.message : err),
      source: sourceUrl,
    });
  }
}

// HLS (.m3u8) sources always redirect - see the long comment above for why
// proxying breaks them. The sources used here are all public test/demo
// infrastructure built specifically to be hotlinked, so a redirect is both
// correct and reliable for them.
function redirectStream(sourceUrl, req, res) {
  return res.redirect(302, sourceUrl);
}

// Picks the right delivery method per source instead of a blanket policy.
function serveStream(sourceUrl, req, res) {
  return isHls(sourceUrl) ? redirectStream(sourceUrl, req, res) : proxyStream(sourceUrl, req, res);
}

router.get("/live/:username/:password/:streamFile", async (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const streamId = parseStreamId(req.params.streamFile);
  const channel = liveStreams.find((s) => s.stream_id === streamId);
  if (!channel) return res.status(404).json({ error: "channel not found" });

  // All current live sources are HLS, but route through serveStream() for
  // consistency and in case an MP4 "loop channel" source is added later.
  return serveStream(channel.source, req, res);
});

router.get("/movie/:username/:password/:streamFile", async (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const streamId = parseStreamId(req.params.streamFile);
  const movie = vodStreams.find((s) => s.stream_id === streamId);
  if (!movie) return res.status(404).json({ error: "movie not found" });

  return serveStream(movie.source, req, res);
});

router.get("/series/:username/:password/:episodeFile", async (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const episodeId = parseStreamId(req.params.episodeFile);
  let found = null;
  series.forEach((s) =>
    s.seasons.forEach((season) =>
      season.episodes.forEach((ep) => {
        if (ep.id === episodeId) found = ep;
      })
    )
  );
  if (!found) return res.status(404).json({ error: "episode not found" });

  return serveStream(found.source, req, res);
});

module.exports = router;
