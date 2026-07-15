const { liveCategories, liveStreams } = require("../data/live");
const { vodCategories, vodStreams } = require("../data/movies");
const { seriesCategories, series } = require("../data/series");

function resolveUrl(base, maybeRelative) {
  if (!maybeRelative) return maybeRelative;
  if (maybeRelative.startsWith("/")) return base + maybeRelative;
  return maybeRelative;
}

function categoryName(categories, id) {
  const found = categories.find((c) => c.category_id === id);
  return found ? found.category_name : "Uncategorized";
}

// Builds the full M3U text - shared by the dynamic /get.php endpoint and
// the static export script (scripts/export-m3u.js), so both always match
// the live catalog exactly. No express dependency, so it's testable and
// runnable standalone.
function buildM3u({ base, username, password }) {
  let m3u = "#EXTM3U\n";

  // --- Live channels ---
  liveStreams.forEach((ch) => {
    const group = categoryName(liveCategories, ch.category_id);
    const logo = resolveUrl(base, ch.stream_icon);
    m3u += `#EXTINF:-1 tvg-id="${ch.epg_channel_id}" tvg-name="${ch.name}" tvg-logo="${logo}" group-title="${group}",${ch.name}\n`;
    m3u += `${base}/live/${username}/${password}/${ch.stream_id}.m3u8\n`;
  });

  // --- Movies (VOD) ---
  vodStreams.forEach((mv) => {
    const group = categoryName(vodCategories, mv.category_id);
    const logo = resolveUrl(base, mv.stream_icon);
    m3u += `#EXTINF:-1 tvg-logo="${logo}" group-title="${group}",${mv.name}\n`;
    m3u += `${base}/movie/${username}/${password}/${mv.stream_id}.${mv.container_extension}\n`;
  });

  // --- Series episodes ---
  series.forEach((show) => {
    const group = categoryName(seriesCategories, show.category_id);
    const logo = resolveUrl(base, show.cover);
    show.seasons.forEach((season) => {
      season.episodes.forEach((ep) => {
        const label = `${show.name} - ${ep.title}`;
        m3u += `#EXTINF:-1 tvg-logo="${logo}" group-title="${group}",${label}\n`;
        m3u += `${base}/series/${username}/${password}/${ep.id}.${ep.container_extension}\n`;
      });
    });
  });

  return m3u;
}

module.exports = { buildM3u };
