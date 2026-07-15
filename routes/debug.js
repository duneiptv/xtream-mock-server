const express = require("express");
const router = express.Router();
const { liveStreams } = require("../data/live");
const { vodStreams } = require("../data/movies");
const { series } = require("../data/series");

const PROXY_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "*/*",
};

async function checkOne(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    // Range: bytes=0-0 asks for just the first byte, so this doesn't
    // download entire multi-hundred-MB films just to check they're alive.
    // Some origins don't support this and ignore it - that's fine, we still
    // get a status code back either way, we just cut the connection after.
    const res = await fetch(url, {
      headers: { ...PROXY_HEADERS, Range: "bytes=0-0" },
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return { ok: res.ok || res.status === 206, status: res.status };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, status: null, error: String(err && err.message ? err.message : err) };
  }
}

// GET /debug/check-sources
// Hits every source URL in the catalog directly from wherever this server
// is actually deployed (which has real outbound network access, unlike a
// local sandbox) and reports back real HTTP status per item. Use this to
// find exactly which entries are dead instead of guessing.
router.get("/debug/check-sources", async (req, res) => {
  const items = [];

  liveStreams.forEach((s) =>
    items.push({ type: "live", stream_id: s.stream_id, name: s.name, url: s.source })
  );
  vodStreams.forEach((s) =>
    items.push({ type: "movie", stream_id: s.stream_id, name: s.name, url: s.source })
  );
  series.forEach((show) =>
    show.seasons.forEach((season) =>
      season.episodes.forEach((ep) =>
        items.push({ type: "series", stream_id: ep.id, name: ep.title, url: ep.source })
      )
    )
  );

  // Run checks with limited concurrency so we don't fire 30 simultaneous
  // outbound requests at once.
  const CONCURRENCY = 5;
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      const item = items[i];
      const check = await checkOne(item.url);
      results[i] = { ...item, ...check };
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const broken = results.filter((r) => !r.ok);
  res.json({
    checked_at: new Date().toISOString(),
    total: results.length,
    working: results.length - broken.length,
    broken: broken.length,
    results,
  });
});

module.exports = router;
