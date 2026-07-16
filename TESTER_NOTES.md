# Test Server Notes for App Reviewers

This app requires a server connection to play content. A test server with
sample content is provided below so playback and content browsing can be
reviewed.

## Server Access

**Xtream Codes login (required for full content - Live TV + VOD)**
- Server URL: `https://xtream-mock.onrender.com`
- Username: `test`
- Password: `test`

**M3U URL / M3U file (Live TV only)**
```
https://xtream-mock.onrender.com/get.php?username=test&password=test&type=m3u_plus&output=ts
```
A downloadable `playlist.m3u` file is also attached. Note: movies (VOD)
are not available through this method - please use the Xtream Codes login
above to review VOD content.

## Multi-audio-track and subtitle content

For testing audio-track switching and subtitles, use the VOD category
**"Multi-Audio and Subtitle Test Clips"** (accessible via Xtream Codes
login). Every title in that category has multiple audio tracks and/or
subtitle tracks available.

## Note on playback

The video streams used on this server are public, freely available test
streams, not our own hosted media. If a specific title fails to play, it's
most likely an issue on the public stream's end rather than the app -
please try another title before treating it as a playback bug.
