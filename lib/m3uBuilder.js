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
//
// group-title values are prefixed with "Live - " / "VOD - ". Standard M3U
// has no real content-type tag, so many lightweight custom players (this
// app included, going by its own working reference playlist which used
// literal group-title="Live" / group-title="VOD") classify content by
// checking for those keywords in group-title and default anything else to
// Live. Our category names alone ("Science Fiction", "Kids and Animation",
// etc.) don't contain either keyword, which is the most likely reason VOD
// wasn't showing up - everything fell into the Live bucket by default.
function buildM3u({ base, username, password }) {
  let m3u = "#EXTM3U\n";

  // --- Live channels ---
  liveStreams.forEach((ch) => {
    const group = `Live - ${categoryName(liveCategories, ch.category_id)}`;
    const logo = resolveUrl(base, ch.stream_icon);
    m3u += `#EXTINF:-1 tvg-id="${ch.epg_channel_id}" tvg-name="${ch.name}" tvg-logo="${logo}" group-title="${group}",${ch.name}\n`;
    m3u += `${base}/live/${username}/${password}/${ch.stream_id}.m3u8\n`;
  });

  // --- Movies (VOD) ---
  vodStreams.forEach((mv) => {
    const group = `VOD - ${categoryName(vodCategories, mv.category_id)}`;
    const logo = resolveUrl(base, mv.stream_icon);
    m3u += `#EXTINF:-1 tvg-logo="${logo}" group-title="${group}",${mv.name}\n`;
    m3u += `${base}/movie/${username}/${password}/${mv.stream_id}.${mv.container_extension}\n`;
  });

  // --- Series episodes (on-demand content, grouped under VOD too since
  // the app likely only has two buckets, matching its reference playlist) ---
  series.forEach((show) => {
    const group = `VOD - ${categoryName(seriesCategories, show.category_id)}`;
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
