const express = require("express");
const router = express.Router();
const { findUser } = require("../data/users");
const { liveStreams } = require("../data/live");
const { vodStreams } = require("../data/movies");
const { getPublicUrl } = require("../lib/publicUrl");

// GET /get.php?username=x&password=y&type=m3u_plus&output=ts
router.get("/get.php", (req, res) => {
  const { username, password } = req.query;
  const user = findUser(username, password);
  if (!user) return res.status(401).send("Invalid credentials");

  const BASE = getPublicUrl().base;
  let m3u = "#EXTM3U\n";

  liveStreams.forEach((ch) => {
    m3u += `#EXTINF:-1 tvg-id="${ch.epg_channel_id}" tvg-name="${ch.name}" tvg-logo="${ch.stream_icon}" group-title="Live",${ch.name}\n`;
    m3u += `${BASE}/live/${username}/${password}/${ch.stream_id}.m3u8\n`;
  });

  vodStreams.forEach((mv) => {
    m3u += `#EXTINF:-1 tvg-logo="${mv.stream_icon}" group-title="Movies",${mv.name}\n`;
    m3u += `${BASE}/movie/${username}/${password}/${mv.stream_id}.${mv.container_extension}\n`;
  });

  res.setHeader("Content-Type", "application/x-mpegurl");
  res.send(m3u);
});

module.exports = router;
