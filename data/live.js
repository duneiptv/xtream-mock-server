// Live "channels" - fictional branding layered on top of the 13 verified,
// confirmed-working public HLS/MP4 sources from /debug/check-sources. Each
// underlying source is reused under several different invented channel
// identities (name/logo/genre) so the catalog looks like a real multi-genre
// lineup instead of 13 bare test streams. All names, logos, and channel
// concepts below are original/invented - not real broadcasters.
//
// Logo scheme: dummyimage.com renders a colored "bug" with the channel's
// initials, tinted per genre, so channels are visually distinguishable at a
// glance without needing real artwork.

const liveCategories = [
  { category_id: "1", category_name: "24/7 News Network", parent_id: 0 },
  { category_id: "2", category_name: "Kids & Animation", parent_id: 0 },
  { category_id: "3", category_name: "Sci-Fi & Fantasy", parent_id: 0 },
  { category_id: "4", category_name: "Arts & Culture", parent_id: 0 },
  { category_id: "5", category_name: "Retro & Classic TV", parent_id: 0 },
  { category_id: "6", category_name: "Test Pattern Network", parent_id: 0 },
  { category_id: "7", category_name: "Documentary & Nature", parent_id: 0 },
  { category_id: "8", category_name: "Music & Nightlife", parent_id: 0 },
];

function logo(text, bg, fg) {
  return `https://dummyimage.com/400x400/${bg}/${fg}.png&text=${encodeURIComponent(text)}`;
}

const SRC = {
  nasaPublic: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
  nasaMedia: "https://ntv2.akamaized.net/hls/live/2013923/NASA-NTV2-HLS/master.m3u8",
  bbbAdaptive: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  tearsOfSteelHls: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  elephantsDream: "https://archive.org/download/Sintel_201709/Elephants%20Dream.mp4",
  sintel: "https://archive.org/download/Sintel_201709/Sintel.mp4",
  bipbopAdvFmp4: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
  bipbop16x9: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
  bipbop4x3: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8",
  mux4k: "https://test-streams.mux.dev/test_001/stream.m3u8",
  akamaiTest1: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
  akamaiTest2: "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8",
  jwDemo: "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8",
};

const liveStreams = [
  // --- News (NASA public feeds, real live footage) ---
  { num: 1, name: "Orbit One Space Network", stream_id: 100, category_id: "1", source: SRC.nasaPublic, stream_icon: logo("O1", "0f172a", "38bdf8"), epg_channel_id: "orbit1.news" },
  { num: 2, name: "Terra Watch Live", stream_id: 101, category_id: "1", source: SRC.nasaMedia, stream_icon: logo("TW", "0f172a", "38bdf8"), epg_channel_id: "terrawatch.news" },
  { num: 3, name: "Frontier Skies TV", stream_id: 102, category_id: "1", source: SRC.nasaPublic, stream_icon: logo("FS", "0f172a", "38bdf8"), epg_channel_id: "frontierskies.news" },
  { num: 4, name: "Cosmodrome Live", stream_id: 103, category_id: "1", source: SRC.nasaMedia, stream_icon: logo("CL", "0f172a", "38bdf8"), epg_channel_id: "cosmodrome.news" },
  { num: 5, name: "Stellar Pulse Network", stream_id: 104, category_id: "1", source: SRC.nasaPublic, stream_icon: logo("SP", "0f172a", "38bdf8"), epg_channel_id: "stellarpulse.news" },

  // --- Kids & Animation (Big Buck Bunny footage) ---
  { num: 6, name: "Bubblegum Burrow TV", stream_id: 105, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("BB", "fbbf24", "1e1b4b"), epg_channel_id: "bubblegum.kids" },
  { num: 7, name: "Snickerdoodle Cartoons", stream_id: 106, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("SC", "fbbf24", "1e1b4b"), epg_channel_id: "snickerdoodle.kids" },
  { num: 8, name: "Rascal Ridge Kids", stream_id: 107, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("RR", "fbbf24", "1e1b4b"), epg_channel_id: "rascalridge.kids" },
  { num: 9, name: "Giggle Grove Junior", stream_id: 108, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("GG", "fbbf24", "1e1b4b"), epg_channel_id: "gigglegrove.kids" },

  // --- Sci-Fi & Fantasy (Tears of Steel / Sintel footage) ---
  { num: 10, name: "Ironclad Sci-Fi Network", stream_id: 109, category_id: "3", source: SRC.tearsOfSteelHls, stream_icon: logo("IC", "1e1b4b", "a78bfa"), epg_channel_id: "ironclad.scifi" },
  { num: 11, name: "Nebula Nine TV", stream_id: 110, category_id: "3", source: SRC.tearsOfSteelHls, stream_icon: logo("N9", "1e1b4b", "a78bfa"), epg_channel_id: "nebulanine.scifi" },
  { num: 12, name: "Quantum Reel Channel", stream_id: 111, category_id: "3", source: SRC.tearsOfSteelHls, stream_icon: logo("QR", "1e1b4b", "a78bfa"), epg_channel_id: "quantumreel.scifi" },
  { num: 13, name: "Dragonglass Fantasy TV", stream_id: 112, category_id: "3", source: SRC.sintel, stream_icon: logo("DF", "14532d", "fde047"), epg_channel_id: "dragonglass.fantasy" },
  { num: 14, name: "Mythwood Channel", stream_id: 113, category_id: "3", source: SRC.sintel, stream_icon: logo("MW", "14532d", "fde047"), epg_channel_id: "mythwood.fantasy" },
  { num: 15, name: "Ember & Ash Network", stream_id: 114, category_id: "3", source: SRC.sintel, stream_icon: logo("EA", "14532d", "fde047"), epg_channel_id: "emberash.fantasy" },

  // --- Arts & Culture (Elephants Dream footage) ---
  { num: 16, name: "Velvet Static Arts", stream_id: 115, category_id: "4", source: SRC.elephantsDream, stream_icon: logo("VS", "27272a", "f472b6"), epg_channel_id: "velvetstatic.arts" },
  { num: 17, name: "Obscura Vision TV", stream_id: 116, category_id: "4", source: SRC.elephantsDream, stream_icon: logo("OV", "27272a", "f472b6"), epg_channel_id: "obscuravision.arts" },

  // --- Retro & Classic TV (BipBop test-pattern footage, styled as retro) ---
  { num: 18, name: "Classic Frame TV", stream_id: 117, category_id: "5", source: SRC.bipbop4x3, stream_icon: logo("CF", "78350f", "fef3c7"), epg_channel_id: "classicframe.retro" },
  { num: 19, name: "Vintage Vault Network", stream_id: 118, category_id: "5", source: SRC.bipbop4x3, stream_icon: logo("VV", "78350f", "fef3c7"), epg_channel_id: "vintagevault.retro" },
  { num: 20, name: "Retro Ray TV", stream_id: 119, category_id: "5", source: SRC.bipbop16x9, stream_icon: logo("RR", "78350f", "fef3c7"), epg_channel_id: "retroray.retro" },

  // --- Test Pattern Network (in-universe "we know exactly what these are" joke channels) ---
  { num: 21, name: "SignalCheck Prime", stream_id: 120, category_id: "6", source: SRC.bipbopAdvFmp4, stream_icon: logo("SC", "111827", "ef4444"), epg_channel_id: "signalcheck.test" },
  { num: 22, name: "Waveform Test Network", stream_id: 121, category_id: "6", source: SRC.akamaiTest1, stream_icon: logo("WF", "111827", "ef4444"), epg_channel_id: "waveform.test" },
  { num: 23, name: "Circuit City Broadcast", stream_id: 122, category_id: "6", source: SRC.akamaiTest2, stream_icon: logo("CC", "111827", "ef4444"), epg_channel_id: "circuitcity.test" },
  { num: 24, name: "Static Sunrise Network", stream_id: 123, category_id: "6", source: SRC.akamaiTest1, stream_icon: logo("SS", "111827", "ef4444"), epg_channel_id: "staticsunrise.test" },

  // --- Documentary & Nature ---
  { num: 25, name: "UltraVision 4K", stream_id: 124, category_id: "7", source: SRC.mux4k, stream_icon: logo("U4", "164e63", "5eead4"), epg_channel_id: "ultravision.docs" },
  { num: 26, name: "Crystal Clarity Network", stream_id: 125, category_id: "7", source: SRC.mux4k, stream_icon: logo("CC", "164e63", "5eead4"), epg_channel_id: "crystalclarity.docs" },

  // --- Music & Nightlife ---
  { num: 27, name: "Harborlight Broadcasting", stream_id: 126, category_id: "8", source: SRC.jwDemo, stream_icon: logo("HB", "581c87", "f0abfc"), epg_channel_id: "harborlight.music" },
  { num: 28, name: "Lantern Bay TV", stream_id: 127, category_id: "8", source: SRC.jwDemo, stream_icon: logo("LB", "581c87", "f0abfc"), epg_channel_id: "lanternbay.music" },
  { num: 29, name: "Metro Wave TV", stream_id: 128, category_id: "8", source: SRC.akamaiTest2, stream_icon: logo("MW", "581c87", "f0abfc"), epg_channel_id: "metrowave.music" },
  { num: 30, name: "Downtown Live Network", stream_id: 129, category_id: "8", source: SRC.akamaiTest1, stream_icon: logo("DL", "581c87", "f0abfc"), epg_channel_id: "downtownlive.music" },
];

module.exports = { liveCategories, liveStreams };
