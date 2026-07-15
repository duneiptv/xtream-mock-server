const express = require("express");
const router = express.Router();
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

router.get("/live/:username/:password/:streamFile", (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const streamId = parseStreamId(req.params.streamFile);
  const channel = liveStreams.find((s) => s.stream_id === streamId);
  if (!channel) return res.status(404).json({ error: "channel not found" });

  // Real Xtream servers proxy/transcode; for a mock, a redirect to the
  // source HLS playlist is enough for any player to consume.
  return res.redirect(302, channel.source);
});

router.get("/movie/:username/:password/:streamFile", (req, res) => {
  const auth = checkAuth(req.params.username, req.params.password);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.reason });

  const streamId = parseStreamId(req.params.streamFile);
  const movie = vodStreams.find((s) => s.stream_id === streamId);
  if (!movie) return res.status(404).json({ error: "movie not found" });

  return res.redirect(302, movie.source);
});

router.get("/series/:username/:password/:episodeFile", (req, res) => {
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

  return res.redirect(302, found.source);
});

module.exports = router;
