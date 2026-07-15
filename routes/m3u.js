const express = require("express");
const router = express.Router();
const { findUser } = require("../data/users");
const { getPublicUrl } = require("../lib/publicUrl");
const { buildM3u } = require("../lib/m3uBuilder");

// GET /get.php?username=x&password=y&type=m3u_plus&output=ts
router.get("/get.php", (req, res) => {
  const { username, password } = req.query;
  const user = findUser(username, password);
  if (!user) return res.status(401).send("Invalid credentials");

  const base = getPublicUrl().base;
  const m3u = buildM3u({ base, username, password });

  res.setHeader("Content-Type", "application/x-mpegurl");
  res.send(m3u);
});

module.exports = router;
