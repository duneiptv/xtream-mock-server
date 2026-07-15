// Generates original SVG poster artwork for every movie/series in the
// catalog. Run with: node scripts/generate-posters.js
// Output: public/posters/<slug>.svg (served statically by server.js)
//
// This is procedural/generative illustration (layered silhouette scenes +
// gradients + poster-style typography), not a photo, stock image, or any
// existing artwork. Each genre gets its own small illustrated scene
// (skyline, horizon, silhouette elements) rather than generic decoration,
// composed with a seeded PRNG so re-runs are stable but every poster in the
// same genre still looks different from its siblings.

const fs = require("fs");
const path = require("path");
const { vodStreams } = require("../data/movies");
const { series } = require("../data/series");

const OUT_DIR = path.join(__dirname, "..", "public", "posters");
fs.mkdirSync(OUT_DIR, { recursive: true });

const W = 400, H = 600;

function esc(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Seeded PRNG so the same slug always renders the same poster, but
// different slugs in the same genre diverge from each other.
function makeRand(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (n) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return h % n;
  };
}

function wrapTitle(title, maxCharsPerLine = 15) {
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
  return lines.slice(0, 3);
}

// --- Reusable shape helpers -------------------------------------------

function hillPath(rand, baseY, amplitude, color, opacity) {
  const p1 = baseY - rand(amplitude);
  const p2 = baseY - rand(amplitude);
  const p3 = baseY - rand(amplitude);
  return `<path d="M 0 ${H} L 0 ${baseY} Q ${W * 0.25} ${p1} ${W * 0.5} ${p2} T ${W} ${p3} L ${W} ${H} Z" fill="${color}" opacity="${opacity}"/>`;
}

function mountainPath(rand, baseY, peakHeight, color, opacity) {
  let d = `M 0 ${H} L 0 ${baseY}`;
  let x = 0;
  const step = 60;
  while (x < W) {
    const peakX = x + step / 2 + rand(20) - 10;
    const peakY = baseY - (peakHeight * 0.4) - rand(peakHeight * 0.6);
    d += ` L ${peakX} ${peakY} L ${x + step} ${baseY - rand(20)}`;
    x += step;
  }
  d += ` L ${W} ${H} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
}

function starScatter(rand, count, accent, yRange) {
  return Array.from({ length: count })
    .map(() => {
      const x = rand(W);
      const y = rand(yRange);
      const r = 0.8 + rand(15) / 10;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="${0.3 + rand(50) / 100}"/>`;
    })
    .join("");
}

function treeShape(cx, baseY, size, color) {
  return `<ellipse cx="${cx}" cy="${baseY - size * 0.9}" rx="${size * 0.55}" ry="${size * 0.6}" fill="${color}"/>
          <rect x="${cx - size * 0.06}" y="${baseY - size * 0.45}" width="${size * 0.12}" height="${size * 0.45}" fill="${color}"/>`;
}

function dragonSilhouette(cx, cy, scale, color, opacity) {
  return `<g transform="translate(${cx},${cy}) scale(${scale})" opacity="${opacity}">
    <path d="M -60 10 Q -30 -30 0 -5 Q 30 -30 60 10 Q 30 0 15 15 Q 5 5 0 15 Q -5 5 -15 15 Q -30 0 -60 10 Z" fill="${color}"/>
    <ellipse cx="0" cy="15" rx="45" ry="9" fill="${color}"/>
    <path d="M 45 15 Q 70 10 85 22 Q 68 20 55 22 Z" fill="${color}"/>
  </g>`;
}

function sheepSilhouette(cx, cy, scale, color) {
  return `<g transform="translate(${cx},${cy}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="42" ry="30" fill="${color}"/>
    <circle cx="-38" cy="-6" r="14" fill="${color}"/>
    <circle cx="-18" cy="-22" r="12" fill="${color}"/>
    <circle cx="10" cy="-24" r="13" fill="${color}"/>
    <circle cx="34" cy="-10" r="12" fill="${color}"/>
    <ellipse cx="-52" cy="4" rx="10" ry="8" fill="${color}"/>
    <rect x="-25" y="24" width="6" height="20" fill="${color}"/>
    <rect x="10" y="26" width="6" height="20" fill="${color}"/>
  </g>`;
}

function tvFrame(rand, accent) {
  return `<rect x="60" y="150" width="280" height="200" rx="10" fill="none" stroke="${accent}" stroke-width="4" opacity="0.55"/>
    <circle cx="80" cy="130" r="6" fill="${accent}" opacity="0.5"/>
    ${Array.from({ length: 10 }).map((_, i) => `<line x1="70" y1="${165 + i * 18}" x2="330" y2="${165 + i * 18}" stroke="${accent}" stroke-width="1" opacity="${0.1 + rand(15) / 100}"/>`).join("")}
    <circle cx="120" cy="480" r="45" fill="none" stroke="${accent}" stroke-width="3" opacity="0.4"/>
    <circle cx="280" cy="480" r="45" fill="none" stroke="${accent}" stroke-width="3" opacity="0.4"/>
    <line x1="163" y1="480" x2="237" y2="480" stroke="${accent}" stroke-width="3" opacity="0.4"/>`;
}

function equalizerBars(rand, accent, cy, count = 28) {
  const barW = (W - 60) / count;
  return Array.from({ length: count })
    .map((_, i) => {
      const x = 30 + i * barW;
      const h = 15 + rand(120);
      return `<rect x="${x}" y="${cy - h / 2}" width="${barW * 0.55}" height="${h}" rx="${barW * 0.25}" fill="${accent}" opacity="${0.5 + rand(40) / 100}"/>`;
    })
    .join("");
}

function soundRings(cx, cy, accent) {
  return [1, 2, 3].map((i) => `<circle cx="${cx}" cy="${cy}" r="${i * 26}" fill="none" stroke="${accent}" stroke-width="2" opacity="${0.5 - i * 0.12}"/>`).join("");
}

function circuitBoard(rand, accent) {
  return Array.from({ length: 7 })
    .map(() => {
      const y = 130 + rand(280);
      const x1 = rand(150);
      const x2 = 250 + rand(120);
      return `<path d="M ${x1} ${y} H ${x2}" stroke="${accent}" stroke-width="1.5" opacity="0.3"/>
              <circle cx="${x1}" cy="${y}" r="3" fill="${accent}" opacity="0.5"/>
              <circle cx="${x2}" cy="${y}" r="3" fill="${accent}" opacity="0.5"/>`;
    })
    .join("");
}

function filmReel(cx, cy, r, accent, opacity) {
  const spokes = Array.from({ length: 6 })
    .map((_, i) => {
      const a = (i * Math.PI) / 3;
      const x = cx + Math.cos(a) * r * 0.55;
      const y = cy + Math.sin(a) * r * 0.55;
      return `<circle cx="${x}" cy="${y}" r="${r * 0.16}" fill="none" stroke="${accent}" stroke-width="2" opacity="${opacity}"/>`;
    })
    .join("");
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${accent}" stroke-width="3" opacity="${opacity}"/>${spokes}`;
}

// --- Genre scene compositions ------------------------------------------
// Each returns { sky, scene } SVG fragments plus the theme's palette.

const THEMES = {
  "10": { // Animated Adventures - warm forest
    sky: ["#fbbf24", "#f97316"], accent: "#fff7ed", tag: "ANIMATED ADVENTURE",
    scene: (rand, accent) => {
      const trees = Array.from({ length: 5 }).map(() => treeShape(20 + rand(360), 470, 60 + rand(50), "#166534"));
      return `<circle cx="320" cy="90" r="46" fill="#fef3c7" opacity="0.9"/>
        ${hillPath(rand, 460, 40, "#22c55e", 0.9)}
        ${hillPath(rand, 500, 30, "#15803d", 1)}
        ${trees.join("")}`;
    },
  },
  "11": { // Science Fiction - night skyline + planet
    sky: ["#0f172a", "#1e1b4b"], accent: "#a78bfa", tag: "SCIENCE FICTION",
    scene: (rand, accent) => `
      ${starScatter(rand, 60, "#e0e7ff", 320)}
      <circle cx="300" cy="120" r="55" fill="#818cf8" opacity="0.85"/>
      <circle cx="300" cy="120" r="70" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
      ${circuitBoard(rand, accent)}
      ${mountainPath(rand, 480, 90, "#1e293b", 0.95)}`,
  },
  "12": { // Fantasy Epics - dusk mountains + dragon
    sky: ["#7c2d12", "#4c1d95"], accent: "#fde047", tag: "FANTASY EPIC",
    scene: (rand, accent) => `
      <circle cx="90" cy="110" r="38" fill="#fde68a" opacity="0.8"/>
      ${mountainPath(rand, 420, 140, "#1e3a2f", 0.7)}
      ${mountainPath(rand, 480, 100, "#14291f", 0.9)}
      ${dragonSilhouette(260, 180, 1.1, "#0f172a", 0.85)}`,
  },
  "13": { // Arthouse & Experimental - abstract collage
    sky: ["#18181b", "#3f3f46"], accent: "#f472b6", tag: "ARTHOUSE",
    scene: (rand, accent) => {
      const shapes = Array.from({ length: 6 })
        .map(() => {
          const x = rand(W), y = 140 + rand(300), s = 20 + rand(70), rot = rand(360);
          return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${accent}" opacity="${0.08 + rand(15) / 100}" transform="rotate(${rot} ${x} ${y})"/>`;
        })
        .join("");
      return `${shapes}<circle cx="200" cy="300" r="70" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
        <circle cx="200" cy="300" r="20" fill="${accent}" opacity="0.6"/>`;
    },
  },
  "14": { // Multi-Audio & Subtitle Test Clips - waveform / broadcast tech
    sky: ["#0c4a6e", "#155e75"], accent: "#5eead4", tag: "MULTI-AUDIO / SUBTITLES",
    scene: (rand, accent) => `
      ${soundRings(200, 220, accent)}
      <circle cx="200" cy="220" r="10" fill="${accent}"/>
      ${equalizerBars(rand, accent, 400)}
      <rect x="140" y="440" width="120" height="34" rx="6" fill="${accent}" opacity="0.9"/>
      <text x="200" y="463" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="700" fill="#0c4a6e" text-anchor="middle">CC</text>`,
  },
  "15": { // Dark Comedy - pasture + sheep + storm crack
    sky: ["#78350f", "#7c2d12"], accent: "#fed7aa", tag: "DARK COMEDY",
    scene: (rand, accent) => `
      ${hillPath(rand, 470, 30, "#a16207", 0.9)}
      ${hillPath(rand, 510, 20, "#854d0e", 1)}
      <path d="M 260 60 L 230 140 L 255 140 L 220 230 L 280 130 L 250 130 Z" fill="${accent}" opacity="0.5"/>
      ${sheepSilhouette(160, 430, 1.3, "#1c1917")}`,
  },
  "16": { // Studio Archive Reels - vintage TV / scanlines
    sky: ["#451a03", "#78350f"], accent: "#fef08a", tag: "ARCHIVE REEL",
    scene: (rand, accent) => tvFrame(rand, accent),
  },
  "17": { // Documentary - ocean/earth horizon
    sky: ["#134e4a", "#0f766e"], accent: "#99f6e4", tag: "DOCUMENTARY",
    scene: (rand, accent) => `
      ${starScatter(rand, 20, accent, 140)}
      <circle cx="320" cy="100" r="40" fill="#ccfbf1" opacity="0.7"/>
      ${hillPath(rand, 440, 50, "#0d9488", 0.6)}
      ${hillPath(rand, 490, 35, "#115e59", 0.9)}
      ${Array.from({ length: 3 }).map((_, i) => `<path d="M 0 ${400 + i * 25} Q 100 ${385 + i * 25} 200 ${400 + i * 25} T 400 ${400 + i * 25}" stroke="${accent}" stroke-width="2" fill="none" opacity="0.35"/>`).join("")}`,
  },
};

function buildSvg({ title, category_id, seedKey, tagOverride, credits, filmReelBadge }) {
  const theme = THEMES[category_id] || THEMES["16"];
  const rand = makeRand(seedKey);
  const [g1, g2] = theme.sky;
  const lines = wrapTitle(title);
  const tag = tagOverride || theme.tag;

  const titleLines = lines
    .map((line, i) => `<tspan x="${W / 2}" dy="${i === 0 ? 0 : 38}">${esc(line)}</tspan>`)
    .join("");
  const titleBlockHeight = lines.length * 38 + 70;
  const scrimTop = H - titleBlockHeight - (credits ? 34 : 14);

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky-${seedKey}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${g1}"/>
      <stop offset="100%" stop-color="${g2}"/>
    </linearGradient>
    <linearGradient id="scrim-${seedKey}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky-${seedKey})"/>
  ${theme.scene(rand, theme.accent)}
  ${filmReelBadge ? filmReel(340, 60, 28, theme.accent, 0.5) : ""}
  <rect x="0" y="${scrimTop}" width="${W}" height="${H - scrimTop}" fill="url(#scrim-${seedKey})"/>
  <text x="${W / 2}" y="${scrimTop + 26}" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="2.5" fill="${theme.accent}" text-anchor="middle">${esc(tag)}</text>
  <text x="${W / 2}" y="${scrimTop + 62}" font-family="Georgia, 'Times New Roman', serif" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">${titleLines}</text>
  ${credits ? `<text x="${W / 2}" y="${H - 16}" font-family="Helvetica, Arial, sans-serif" font-size="9" letter-spacing="0.5" fill="#d4d4d8" text-anchor="middle" opacity="0.85">${esc(credits)}</text>` : ""}
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" fill="none" stroke="#fff" stroke-width="1" opacity="0.15"/>
</svg>`;
}

function creditsLine(movie) {
  if (!movie.cast || movie.cast.startsWith("Archival")) return movie.director && movie.director !== "Unknown" ? `DIRECTED BY ${movie.director.toUpperCase()}` : "";
  const first = movie.cast.split(",")[0].trim();
  return `STARRING ${first.toUpperCase()}${movie.director ? ` · DIRECTED BY ${movie.director.toUpperCase()}` : ""}`;
}

let count = 0;
vodStreams.forEach((movie) => {
  const slug = movie.stream_icon.replace("/posters/", "").replace(".svg", "");
  const svg = buildSvg({
    title: movie.name,
    category_id: movie.category_id,
    seedKey: slug,
    credits: creditsLine(movie),
    filmReelBadge: movie.category_id === "16",
  });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, "utf8");
  count++;
});

const SERIES_THEME_MAP = { "20": "10", "21": "12" };
series.forEach((show) => {
  const slug = show.cover.replace("/posters/", "").replace(".svg", "");
  const svg = buildSvg({
    title: show.name,
    category_id: SERIES_THEME_MAP[show.category_id] || "16",
    seedKey: slug,
    tagOverride: "SERIES",
    credits: show.cast && show.cast !== "Various" ? `STARRING ${show.cast.split(",")[0].trim().toUpperCase()}` : "",
  });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.svg`), svg, "utf8");
  count++;
});

console.log(`Generated ${count} posters in ${OUT_DIR}`);
