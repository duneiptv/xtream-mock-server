# xtream-mock-server

A local mock **Xtream Codes** server for testing IPTV apps (Android TV, LG
webOS, Samsung Tizen, etc.) without depending on a real/unstable provider.
Implements the standard endpoints your app already expects:

- `player_api.php` — login, categories, live/VOD/series streams, series info, short EPG
- `get.php` — M3U playlist export (`type=m3u_plus`)
- `xmltv.php` — full XMLTV EPG export
- `/live/...`, `/movie/...`, `/series/...` — stream endpoints that redirect to real, legally-shareable media

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:8080` by default. Override with:

```bash
PORT=9000 SERVER_HOST=192.168.1.50 npm start
```

Set `SERVER_HOST` to your machine's LAN IP (not `localhost`) if you're
testing on a physical Android TV / Fire TV / LG / Samsung device rather than
an emulator — those devices can't resolve your dev machine's `localhost`.

## Deploying it live (not just localhost)

The server reads one env var to know what URL to hand back to clients:
`PUBLIC_BASE_URL`. Set it to wherever the server is actually reachable —
without this, `server_info.url` and every M3U link will still say
`localhost`, which is useless to a client on another network.

```bash
PUBLIC_BASE_URL=https://your-app.onrender.com
```

Any option below works — pick based on what you're comfortable with:

### Option A: Render.com (easiest, free tier available)
1. Push this folder to a GitHub repo.
2. Render dashboard → New → Web Service → connect the repo.
3. Runtime: Docker (it'll pick up the included `Dockerfile` automatically),
   or Node if you'd rather set build command `npm install` and start command
   `node server.js`.
4. Add an environment variable: `PUBLIC_BASE_URL` = the `.onrender.com` URL
   Render assigns you (you'll see it after the first deploy — add the var,
   then redeploy).
5. Done. Point your IPTV app at that URL on port 443 (Render terminates TLS
   for you, so use `https://` and no port).

### Option B: Railway.app / Fly.io
Same idea — both auto-detect the `Dockerfile`. Set `PUBLIC_BASE_URL` to
the domain they assign you (Railway: Settings → generate a domain; Fly:
`fly.io` app name → `flyctl launch`, then `flyctl deploy`).

### Option C: A plain VPS (DigitalOcean, EC2, etc.)
```bash
git clone <your-repo> && cd xtream-mock-server
npm install
PORT=8080 PUBLIC_BASE_URL=http://<your-server-ip>:8080 npm start
```
Run it under `pm2` or a systemd service so it survives reboots/SSH
disconnects:
```bash
npm install -g pm2
PUBLIC_BASE_URL=http://<your-server-ip>:8080 pm2 start server.js --name xtream-mock
pm2 save && pm2 startup
```
Open port 8080 in your firewall/security group. For a real domain + HTTPS,
put Caddy or nginx in front (Caddy will auto-provision a cert with just a
domain name pointed at the box), then set `PUBLIC_BASE_URL` to the
`https://` domain instead.

### A note on the streamed content
Nothing about going public changes the legal picture — the server still
just **redirects** clients to Blender Foundation / Apple's own CDNs for the
actual video bytes (see "Content sources" below); your server never stores
or re-hosts that media itself. The only thing exposed publicly is your
catalog metadata, test credentials, and generated EPG data — so don't put
anything sensitive in `data/users.js` if the deployment is reachable by
anyone other than you.

## Test accounts

| Username    | Password    | Scenario                              |
|-------------|-------------|----------------------------------------|
| `test`      | `test`      | Active, never expires                  |
| `qa1`       | `qa1pass`   | Active, per-tester login (`max_connections=2`) |
| `qa2`       | `qa2pass`   | Active, per-tester login                |
| `qa3`       | `qa3pass`   | Active, per-tester login                |
| `trial`     | `trial`     | Active, expires in 24h                 |
| `expired`   | `expired`   | Already expired                        |
| `disabled`  | `disabled`  | Account disabled                       |
| `multiuser` | `multiuser` | `max_connections=2`, for concurrency tests |

`qa1`/`qa2`/`qa3` exist so each tester has their own login instead of
sharing one — easier to tell from server logs who's testing what, and
one person's session doesn't collide with another's. Add more in
`data/users.js` (copy the `qa1` block, change username/password/max
connections) if your team is bigger than three.

Edit `data/users.js` to add more accounts or change expiry windows.

## Running this for a QA team

A few things matter once more than one person is hitting it:

- **Rate limiting is on by default** (120 requests/min per IP) to absorb bots
  that scan for open Xtream servers, or a test client stuck retrying in a
  loop. If several testers running several apps each polling regularly start
  hitting 429s, raise it: `RATE_LIMIT_MAX=300 RATE_LIMIT_WINDOW_MS=60000`.
- **Avoid free tiers that sleep on inactivity** (e.g. Render's free web
  service spins down after 15 min idle and takes ~30s to wake back up) —
  testers will assume the server is broken rather than just cold-starting.
  Railway and Fly.io's free/hobby tiers don't sleep; on Render, a small paid
  instance avoids it too.
- **`/healthz`** returns `{ok: true}` — point your host's health check /
  uptime monitor at it.
- Share the base URL + each tester's own username/password rather than one
  shared login.

## Point your app at it

Most Xtream-compatible apps ask for **Server URL / Username / Password**:

- Server: `http://<your-ip>:8080`
- Username / Password: any pair from the table above

Apps that instead want an **M3U URL**:

```
http://<your-ip>:8080/get.php?username=test&password=test&type=m3u_plus&output=ts
```

## Content sources

The catalog now has 28 playable items (11 live channels, 14 movies, 3 series
episodes) across live/VOD/series, all pointing at verified, widely-used
public test infrastructure instead of one-off links:

- **Movies & series episodes**: served from Google's `gtv-videos-bucket`
  sample set (`storage.googleapis.com/gtv-videos-bucket/sample/...`) —
  published by Google for Chromecast/Google TV sample-app testing and used
  as the de facto standard public test-video set across the industry for
  years. Includes the Blender Foundation's Creative Commons (CC-BY) short
  films (Big Buck Bunny, Elephants Dream, Sintel, Tears of Steel) plus
  several Google-produced demo/ad clips also released for public sample use.
- **Live channels**: Apple's official public HLS test streams (`bipbop`
  variants — the same ones Apple's own developer docs use), Mux's public
  test streams (`test-streams.mux.dev`), Akamai's public live test feeds,
  and a couple of the same Google-bucket movies looped as "channels." NASA's
  public stream is also included but is the least stable of the bunch (see
  warning below).

⚠️ **Third-party URLs can rot.** NASA in particular has changed its public
stream endpoint before, and any of these could theoretically go down. If a
channel or movie stops playing:
1. Open `data/live.js` or `data/movies.js` and find the entry by `stream_id`.
2. Swap the `source` value for a fresh one. Good places to find current
   public test streams: [Apple's HLS examples
   page](https://developer.apple.com/streaming/examples/),
   [test-streams.mux.dev](https://test-streams.mux.dev/), or search "public
   HLS test stream" / "M3U8 test URLs" for current community-maintained lists.
3. Avoid `bitdash-a.akamaihd.net` — it's a deprecated Bitmovin demo domain
   that's frequently down; everything here has already been steered away
   from it.

## Using your own local media instead

To avoid depending on any external URL at all, drop your own files (or more
Pexels/Pixabay/public-domain clips) into a folder like `media/`, serve it
statically:

```js
// add to server.js
app.use("/media", express.static("media"));
```

...then set any `source` field in `data/live.js` / `data/movies.js` /
`data/series.js` to `http://<host>:<port>/media/yourfile.mp4`.

## Simulating edge cases

- **Expired subscription**: log in as `expired`
- **Disabled account**: log in as `disabled`
- **Max connections**: log in as `multiuser` from 3 devices, add logic in
  `lib/auth.js` to reject the 3rd if you want to test that specific UX
- **Bad EPG / missing channel**: request `get_short_epg` with a `stream_id`
  that doesn't exist in `data/live.js`
- **Dead stream URL**: temporarily point a channel's `source` at a bad URL to
  test your app's error/retry handling

## Project structure

```
server.js              # entrypoint, wires up routes
lib/auth.js             # credential + status checking, user_info/server_info shape
lib/epg.js               # XMLTV + short_epg generation
routes/player_api.js     # the core Xtream JSON API
routes/m3u.js            # get.php M3U export
routes/streams.js        # /live, /movie, /series redirect endpoints
data/users.js             # test accounts
data/live.js              # live channel catalog
data/movies.js             # VOD movie catalog
data/series.js              # series/season/episode catalog
```
