// Resolves the base URL that gets embedded in API responses and stream links
// (server_info.url, M3U entries, etc). This matters once the server isn't on
// localhost anymore - clients need a URL they can actually reach.
//
// Configure via ONE of these, in priority order:
//
// 1. PUBLIC_BASE_URL - full URL, use this for real deployments, e.g.
//      PUBLIC_BASE_URL=https://my-xtream-mock.onrender.com
//    (no trailing slash, include https:// if the platform terminates TLS)
//
// 2. SERVER_HOST (+ optional SERVER_PROTOCOL) - for LAN testing against a
//    physical device, e.g. SERVER_HOST=192.168.1.50 SERVER_PORT=8080
//
// 3. Falls back to http://localhost:<PORT> for local dev with no env vars set.

function getPublicUrl() {
  if (process.env.PUBLIC_BASE_URL) {
    const parsed = new URL(process.env.PUBLIC_BASE_URL);
    return {
      protocol: parsed.protocol.replace(":", ""),
      host: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      base: process.env.PUBLIC_BASE_URL.replace(/\/$/, ""),
    };
  }

  const protocol = process.env.SERVER_PROTOCOL || "http";
  const host = process.env.SERVER_HOST || "localhost";
  const port = process.env.PORT || 8080;
  // Most platforms (Render, Railway, Fly, behind nginx/Caddy) terminate TLS
  // on 443/80 and proxy internally, so don't append the port for https.
  const portSuffix = protocol === "https" ? "" : `:${port}`;

  return {
    protocol,
    host,
    port,
    base: `${protocol}://${host}${portSuffix}`,
  };
}

module.exports = { getPublicUrl };
