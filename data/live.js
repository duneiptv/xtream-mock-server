// Live "channels" backed by well-known, widely-documented public HLS test
// streams (Apple, Akamai, Mux) plus a couple of VOD files looped as if they
// were channels. These are the same URLs used industry-wide by player
// vendors (hls.js, Bitmovin, JW Player, video.js) for their own test/demo
// pages, so they're about as stable as public test infrastructure gets.
//
// NOTE: these are still third-party demo/test endpoints, not something we
// control. If one ever goes down, swap the `source` value - see README.

const liveCategories = [
  { category_id: "1", category_name: "News", parent_id: 0 },
  { category_id: "2", category_name: "Movie Loops", parent_id: 0 },
  { category_id: "3", category_name: "Demo / Test Patterns", parent_id: 0 },
  { category_id: "4", category_name: "Live Test Feeds", parent_id: 0 },
];

const liveStreams = [
  {
    num: 1,
    name: "NASA TV (Public)",
    stream_type: "live",
    stream_id: 100,
    stream_icon: "https://picsum.photos/seed/nasa/300/300",
    category_id: "1",
    // NASA rotates this endpoint occasionally - if it 404s, search
    // "NASA TV public HLS stream" for the current one.
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
    name: "Elephants Dream (Loop)",
    stream_type: "live",
    stream_id: 102,
    stream_icon: "https://picsum.photos/seed/elephantsdream/300/300",
    category_id: "2",
    source: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    epg_channel_id: "elephantsdream.loop",
  },
  {
    num: 4,
    name: "Sintel (Loop)",
    stream_type: "live",
    stream_id: 103,
    stream_icon: "https://picsum.photos/seed/sintelloop/300/300",
    category_id: "2",
    source: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    epg_channel_id: "sintel.loop",
  },
  {
    num: 5,
    name: "Tears of Steel (Loop, HLS)",
    stream_type: "live",
    stream_id: 104,
    stream_icon: "https://picsum.photos/seed/tosloop/300/300",
    category_id: "2",
    source: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    epg_channel_id: "tos.loop",
  },
  {
    num: 6,
    name: "Apple BipBop (Advanced fMP4)",
    stream_type: "live",
    stream_id: 105,
    stream_icon: "https://picsum.photos/seed/bipbopadv/300/300",
    category_id: "3",
    source: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    epg_channel_id: "apple.bipbop.adv",
  },
  {
    num: 7,
    name: "Apple BipBop (16x9)",
    stream_type: "live",
    stream_id: 106,
    stream_icon: "https://picsum.photos/seed/bipbop169/300/300",
    category_id: "3",
    source: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
    epg_channel_id: "apple.bipbop.16x9",
  },
  {
    num: 8,
    name: "Apple BipBop (4x3)",
    stream_type: "live",
    stream_id: 107,
    stream_icon: "https://picsum.photos/seed/bipbop43/300/300",
    category_id: "3",
    source: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8",
    epg_channel_id: "apple.bipbop.4x3",
  },
  {
    num: 9,
    name: "Mux 4K ABR Demo",
    stream_type: "live",
    stream_id: 108,
    stream_icon: "https://picsum.photos/seed/mux4k/300/300",
    category_id: "3",
    source: "https://test-streams.mux.dev/test_001/stream.m3u8",
    epg_channel_id: "mux.4k",
  },
  {
    num: 10,
    name: "Akamai Live Test Feed 1",
    stream_type: "live",
    stream_id: 109,
    stream_icon: "https://picsum.photos/seed/akamai1/300/300",
    category_id: "4",
    source: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    epg_channel_id: "akamai.test1",
  },
  {
    num: 11,
    name: "Akamai Live Test Feed 2",
    stream_type: "live",
    stream_id: 110,
    stream_icon: "https://picsum.photos/seed/akamai2/300/300",
    category_id: "4",
    source: "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8",
    epg_channel_id: "akamai.test2",
  },
];

module.exports = { liveCategories, liveStreams };
