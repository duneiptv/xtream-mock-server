// Generates original SVG poster artwork for every movie in data/movies.js.
// Run with: node scripts/generate-posters.js
// Output: public/posters/<slug>.svg (served statically by server.js)
//
// This is procedural/generative art (gradients + abstract shapes + type),
// not a photo or any existing artwork - themed per genre so the catalog
// has visual variety without needing external images.

const fs = require("fs");
const path = require("path");
const { vodStreams, vodCategories } = require("../data/movies");

const OUT_DIR = path.join(__dirname, "..", "public", "posters");
fs.mkdirSync(OUT_DIR, { recursive: true });

// Genre visual themes, keyed by category_id from data/movies.js
const THEMES = {
  "10": { name: "animated", grad: ["#f59e0b", "#dc2626"], accent: "#fef3c7", motif: "leaves" },      // Animated Adventures
  "11": { name: "scifi", grad: ["#1e1b4b", "#312e81"], accent: "#a78bfa", motif: "circuit" },          // Science Fiction
  "12": { name: "fantasy", grad: ["#14532d", "#78350f"], accent: "#fde047", motif: "wings" },          // Fantasy Epics
  "13": { name: "arthouse", grad: ["#18181b", "#3f3f46"], accent: "#f472b6", motif: "lines" },         // Arthouse
  "14": { name: "tech", grad: ["#0c4a6e", "#155e75"], accent: "#5eead4", motif: "waveform" },          // Multi-Audio/Subs
  "15": { name: "comedy", grad: ["#78350f", "#7c2d12"], accent: "#fed7aa", motif: "blob" },            // Dark Comedy
  "16": { name: "archive", grad: ["#451a03", "#78350f"], accent: "#fef08a", motif: "reel" },           // Studio Archive
  "17": { name: "docs", grad: ["#134e4a", "#0f766e"], accent: "#99f6e4", motif: "waves" },             // Documentary
};

function esc(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapTitle(title, maxCharsPerLine = 16) {
  const words = title.split(" ");
  const lines = [];
  let current = "";
  words.forEach((w) => {
    if ((current + " " + w).trim().length > maxCharsPerLine && current) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

function motifShapes(motif, accent, seed) {
  // Simple deterministic pseudo-randomness from the seed string so re-runs
  // are stable (same slug always produces the same layout).
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = (n) => (h = (h * 1103515245 + 12345) >>> 0) % n;

  switch (motif) {
    case "leaves":
      return Array.from({ length: 6 })
        .map((_, i) => {
          const cx = 40 + rand(320);
          const cy = 380 + rand(180);
          const r = 14 + rand(20);
          return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="0.18"/>`;
        })
        .join("");
    case "circuit":
      return Array.from({ length: 5 })
        .map((_, i) => {
          const y = 420 + i * 30;
          return `<path d="M 20 ${y} H ${180 + rand(150)} V ${y - 12} H 380" stroke="${accent}" stroke-width="2" fill="none" opacity="0.35"/><circle cx="380" cy="${y - 12}" r="4" fill="${accent}" opacity="0.5"/>`;
        })
        .join("");
    case "wings":
      return `<path d="M 0 460 Q 200 380 400 460 L 400 600 L 0 600 Z" fill="${accent}" opacity="0.15"/>
              <path d="M 60 500 Q 200 440 340 500" stroke="${accent}" stroke-width="3" fill="none" opacity="0.4"/>`;
    case "lines":
      return Array.from({ length: 8 })
        .map((_, i) => `<line x1="0" y1="${60 + i * 60}" x2="400" y2="${20 + i * 60}" stroke="${accent}" stroke-width="1" opacity="0.15"/>`)
        .join("");
    case "waveform":
      return Array.from({ length: 24 })
        .map((_, i) => {
          const x = 20 + i * 15.6;
          const barH = 20 + rand(90);
          return `<rect x="${x}" y="${470 - barH / 2}" width="6" height="${barH}" rx="3" fill="${accent}" opacity="0.5"/>`;
        })
        .join("");
    case "blob":
      return `<ellipse cx="200" cy="470" rx="150" ry="80" fill="${accent}" opacity="0.15"/>
              <ellipse cx="140" cy="440" rx="40" ry="30" fill="${accent}" opacity="0.2"/>`;
    case "reel":
      return `<circle cx="120" cy="480" r="55" fill="none" stroke="${accent}" stroke-width="3" opacity="0.35"/>
              <circle cx="280" cy="480" r="55" fill="none" stroke="${accent}" stroke-width="3" opacity="0.35"/>
              <circle cx="120" cy="480" r="10" fill="${accent}" opacity="0.4"/>
              <circle cx="280" cy="480" r="10" fill="${accent}" opacity="0.4"/>
              <line x1="175" y1="480" x2="225" y2="480" stroke="${accent}" stroke-width="3" opacity="0.35"/>`;
    case "waves":
      return Array.from({ length: 4 })
        .map((_, i) => `<path d="M 0 ${420 + i * 35} Q 100 ${400 + i * 35} 200 ${420 + i * 35} T 400 ${420 + i * 35}" stroke="${accent}" stroke-width="2" fill="none" opacity="0.3"/>`)
        .join("");
    default:
      return "";
  }
}

function buildSvg({ title, category_id, seedKey, badge }) {
  const theme = THEMES[category_id] || THEMES["16"];
  const [g1, g2] = theme.grad;
  const lines = wrapTitle(title);
  const titleY = 300 - (lines.length - 1) * 20;

  const titleLines = lines
    .map((line, i) => `<tspan x="200" dy="${i === 0 ? 0 : 42}">${esc(line)}</tspan>`)
    .join("");

  const badgeSvg = badge
    ? `<rect x="20" y="20" width="70" height="28" rx="6" fill="${theme.accent}" opacity="0.9"/>
       <text x="55" y="39" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#111" text-anchor="middle">${esc(badge)}</text>`
    : "";

  return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${g1}"/>
      <stop offset="100%" stop-color="${g2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bg)"/>
  ${motifShapes(theme.motif, theme.accent, seedKey)}
  <rect x="0" y="0" width="400" height="600" fill="#000" opacity="0.08"/>
  ${badgeSvg}
  <text x="200" y="${titleY}" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" fill="#fff" text-anchor="middle" style="letter-spacing:0.5px">${titleLines}</text>
  <line x1="140" y1="${titleY + lines.length * 42 - 10}" x2="260" y2="${titleY + lines.length * 42 - 10}" stroke="${theme.accent}" stroke-width="2" opacity="0.6"/>
</svg>`;
}

let count = 0;
vodStreams.forEach((movie) => {
  const slug = movie.stream_icon.replace("/posters/", "").replace(".svg", "");
  const badge = movie.category_id === "14" ? "CC/MULTI-AUDIO" : movie.category_id === "16" ? "ARCHIVE" : null;
  const svg = buildSvg({
    title: movie.name,
    category_id: movie.category_id,
    seedKey: slug,
    badge,
  });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, "utf8");
  count++;
});

// Series covers - series.js uses different category ids (20/21), so map
// them onto the closest movie theme for a visually consistent look.
const { series } = require("../data/series");
const SERIES_THEME_MAP = { "20": "10", "21": "12" };
series.forEach((show) => {
  const slug = show.cover.replace("/posters/", "").replace(".svg", "");
  const svg = buildSvg({
    title: show.name,
    category_id: SERIES_THEME_MAP[show.category_id] || "16",
    seedKey: slug,
    badge: "SERIES",
  });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, "utf8");
  count++;
});

console.log(`Generated ${count} posters in ${OUT_DIR}`);
