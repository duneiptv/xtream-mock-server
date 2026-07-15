// Generates a standalone, downloadable .m3u playlist file covering the
// entire catalog (live channels + movies + series episodes), using the
// same builder as the live /get.php endpoint - so this file and the
// dynamic endpoint always produce identical results.
//
// Usage:
//   node scripts/export-m3u.js [baseUrl] [username] [password] [outFile]
//
// Defaults to the deployed Render URL and the "test" account. Re-run any
// time the catalog changes to refresh the exported file.

const fs = require("fs");
const path = require("path");
const { buildM3u } = require("../lib/m3uBuilder");

const base = process.argv[2] || "https://xtream-mock.onrender.com";
const username = process.argv[3] || "test";
const password = process.argv[4] || "test";
const outFile = process.argv[5] || path.join(__dirname, "..", "playlist.m3u");

const m3u = buildM3u({ base, username, password });
fs.writeFileSync(outFile, m3u, "utf8");

const entryCount = m3u.split("\n").filter((l) => l.startsWith("#EXTINF")).length;
console.log(`Wrote ${entryCount} entries to ${outFile}`);
console.log(`Base URL: ${base}  |  Account: ${username}/${password}`);
