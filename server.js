const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { generateXmltv } = require("./lib/epg");
const { findUser } = require("./data/users");
const { getPublicUrl } = require("./lib/publicUrl");
const { rateLimiter } = require("./lib/rateLimit");

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0"; // bind all interfaces - required by every hosting platform, and for LAN device testing

app.use(morgan("dev"));

// Generated poster artwork (see scripts/generate-posters.js) - served as
// static files so /posters/<slug>.svg resolves to a real URL for clients.
app.use("/posters", express.static(path.join(__dirname, "public", "posters")));

// Protects against the endpoint getting hammered by bots scanning for open
// Xtream servers, or a misbehaving test client retrying in a loop. Tune via
// RATE_LIMIT_MAX / RATE_LIMIT_WINDOW_MS if a QA team of several people +
// several apps each polling regularly needs more headroom.
app.use(
  rateLimiter({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
    max: Number(process.env.RATE_LIMIT_MAX) || 120,
  })
);

// Health check - hosting platforms (Render, Railway, Fly, k8s, etc.) poll
// this to know the app is alive; doesn't count against auth logic.
app.get("/healthz", (req, res) => res.json({ ok: true }));

// --- Xtream API routes ---
app.use(require("./routes/player_api"));
app.use(require("./routes/m3u"));
app.use(require("./routes/streams"));
app.use(require("./routes/debug"));

// EPG export - GET /xmltv.php?username=x&password=y
app.get("/xmltv.php", (req, res) => {
  const { username, password } = req.query;
  if (!findUser(username, password)) return res.status(401).send("Invalid credentials");
  res.setHeader("Content-Type", "application/xml");
  res.send(generateXmltv());
});

// Quick sanity page
app.get("/", (req, res) => {
  const base = getPublicUrl().base;
  res.json({
    message: "xtream-mock-server is running",
    try_these: {
      login: `${base}/player_api.php?username=test&password=test`,
      live_categories: `${base}/player_api.php?username=test&password=test&action=get_live_categories`,
      vod_streams: `${base}/player_api.php?username=test&password=test&action=get_vod_streams`,
      m3u_playlist: `${base}/get.php?username=test&password=test&type=m3u_plus&output=ts`,
      epg: `${base}/xmltv.php?username=test&password=test`,
    },
    test_accounts: [
      "test / test (active, never expires)",
      "qa1 / qa1pass, qa2 / qa2pass, qa3 / qa3pass (per-tester logins)",
      "trial / trial (active, expires in 24h)",
      "expired / expired (expired yesterday)",
      "disabled / disabled (account disabled)",
      "multiuser / multiuser (max_connections=2)",
    ],
  });
});

app.listen(PORT, HOST, () => {
  const base = getPublicUrl().base;
  console.log(`xtream-mock-server listening on 0.0.0.0:${PORT}`);
  console.log(`Public URL resolves to: ${base}`);
  if (base.includes("localhost") && !process.env.PUBLIC_BASE_URL) {
    console.log(
      `NOTE: set PUBLIC_BASE_URL (e.g. https://your-app.onrender.com) once deployed, so API responses and M3U links point somewhere your app can actually reach.`
    );
  }
  console.log(`Try: ${base}/player_api.php?username=test&password=test`);
});
