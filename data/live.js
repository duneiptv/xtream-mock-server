// Live "channels" — each backed by a legally shareable HLS test stream.
// Swap `source` for your own hosted stream any time; the API shape stays the same.

const liveCategories = [
  { category_id: "1", category_name: "News", parent_id: 0 },
  { category_id: "2", category_name: "Nature", parent_id: 0 },
  { category_id: "3", category_name: "Demo / Test Patterns", parent_id: 0 },
];

const liveStreams = [
  {
    num: 1,
    name: "NASA TV (Public)",
    stream_type: "live",
    stream_id: 100,
    stream_icon: "https://picsum.photos/seed/nasa/300/300",
    category_id: "1",
    // NASA public stream — verify current URL before relying on it long-term,
    // NASA occasionally rotates their public distribution endpoints.
    source: "https://ntv1.lvlt.diginsite.com/nasa/ntv1/playlist.m3u8",
    epg_channel_id: "nasa.tv",
  },
  {
    num: 2,
    name: "Big Buck Bunny (Loop)",
    stream_type: "live",
    stream_id: 101,
    stream_icon: "https://picsum.photos/seed/bbb/300/300",
    category_id: "2",
    source: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    epg_channel_id: "bbb.loop",
  },
  {
    num: 3,
    name: "Apple HLS Test Stream",
    stream_type: "live",
    stream_id: 102,
    stream_icon: "https://picsum.photos/seed/testcard/300/300",
    category_id: "3",
    // Apple's official public HLS example stream — used industry-wide for testing.
    source:
      "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    epg_channel_id: "test.pattern",
  },
];

module.exports = { liveCategories, liveStreams };
