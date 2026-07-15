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

// Proxies the actual media bytes through OUR server instead of a 302
// redirect. This matters for two reasons:
//  1. Some origins apply hotlink/bot-detection to requests that arrive with
//     a media-player User-Agent and no session history (this is what broke
//     Google's sample bucket for us) - a server-to-server fetch avoids that.
//  2. Some IPTV clients (especially certain Smart TV players) don't reliably
//     follow 3xx redirects for streaming URLs, particularly once Range
//     requests (seeking) are involved.
// Forwards the client's Range header upstream so seeking/scrubbing works,
// and mirrors the upstream status/headers back so the client sees a normal
// 200 or 206 response instead of a redirect.
async function proxyStream(sourceUrl, req, res) {
  try {
    const headers = {};
    if (req.headers.range) headers.range = req.headers.range;

    const upstream = await fetch(sourceUrl, { headers, redirect: "follow" });

    if (!upstream.ok && upstream.status !== 206) {
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
    res.status(502).json({
      error: "failed to reach upstream source",
      detail: String(err && err.message ? err.message : err),
      source: sourceUrl,
    });
  }
}

router.get("/live/:username/:password/:streamFile", async (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const streamId = parseStreamId(req.params.streamFile);
  const channel = liveStreams.find((s) => s.stream_id === streamId);
  if (!channel) return res.status(404).json({ error: "channel not found" });

  // Live HLS playlists reference their own segment URLs relatively, so a
  // full proxy would need to rewrite the manifest - out of scope here.
  // A redirect works fine for these since they're all public test/demo
  // infrastructure built specifically to be hotlinked.
  return res.redirect(302, channel.source);
});

router.get("/movie/:username/:password/:streamFile", async (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const streamId = parseStreamId(req.params.streamFile);
  const movie = vodStreams.find((s) => s.stream_id === streamId);
  if (!movie) return res.status(404).json({ error: "movie not found" });

  return proxyStream(movie.source, req, res);
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

  return proxyStream(found.source, req, res);
});

module.exports = router;
