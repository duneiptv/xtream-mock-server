// Minimal in-memory rate limiter. Good enough for a small QA team hitting
// a test server - not meant for large-scale production traffic (state is
// per-process and resets on restart/redeploy, which is fine here).

function rateLimiter({ windowMs = 60_000, max = 60 } = {}) {
  const hits = new Map(); // ip -> [timestamps]

  // periodic cleanup so the map doesn't grow forever
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, timestamps] of hits) {
      const recent = timestamps.filter((t) => t > cutoff);
      if (recent.length === 0) hits.delete(ip);
      else hits.set(ip, recent);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;
    const now = Date.now();
    const cutoff = now - windowMs;
    const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff);

    if (timestamps.length >= max) {
      return res.status(429).json({ error: "Too many requests, slow down." });
    }

    timestamps.push(now);
    hits.set(ip, timestamps);
    next();
  };
}

module.exports = { rateLimiter };
