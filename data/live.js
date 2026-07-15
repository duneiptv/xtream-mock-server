// Live "channels" - fictional branding layered on top of verified, confirmed
// working public HLS/MP4 sources (checked via /debug/check-sources and, for
// newer additions, fetched directly). Each underlying source is reused under
// several different invented channel identities so the catalog looks like a
// real multi-genre lineup. All names/logos/channel concepts are invented.
//
// NASA's streams were removed - they returned 200 on a manifest HEAD check
// but didn't actually play for testers, so treating them as broken per
// real-world testing rather than the shallow status check.
//
// Logo scheme: dummyimage.com renders a colored "bug" with the channel's
// initials, tinted per genre.

const liveCategories = [
  { category_id: "1", category_name: "World News Network", parent_id: 0 },
  { category_id: "2", category_name: "Kids & Animation", parent_id: 0 },
  { category_id: "3", category_name: "Sci-Fi & Fantasy", parent_id: 0 },
  { category_id: "4", category_name: "Arts & Culture", parent_id: 0 },
  { category_id: "5", category_name: "Retro & Classic TV", parent_id: 0 },
  { category_id: "6", category_name: "Test Pattern Network", parent_id: 0 },
  { category_id: "7", category_name: "Documentary & Nature", parent_id: 0 },
  { category_id: "8", category_name: "Music & Nightlife", parent_id: 0 },
  { category_id: "9", category_name: "Sports & Action", parent_id: 0 },
];

function logo(text, bg, fg) {
  return `https://dummyimage.com/400x400/${bg}/${fg}.png&text=${encodeURIComponent(text)}`;
}

const SRC = {
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
  jwDemo1: "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8",
  jwDemo2: "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8",
  skate4k: "https://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
  historicPlanet: "https://devstreaming-cdn.apple.com/videos/streaming/examples/historic_planet_content_2023-10-26-3d-video/main.m3u8",
};

const liveStreams = [
  // --- World News Network (repurposed - no longer NASA-dependent) ---
  { num: 1, name: "Meridian World News", stream_id: 130, category_id: "1", source: SRC.akamaiTest1, stream_icon: logo("MW", "0f172a", "38bdf8"), epg_channel_id: "meridian.news" },
  { num: 2, name: "Northstar Daily News", stream_id: 131, category_id: "1", source: SRC.akamaiTest2, stream_icon: logo("ND", "0f172a", "38bdf8"), epg_channel_id: "northstar.news" },
  { num: 3, name: "Horizon 24 News", stream_id: 132, category_id: "1", source: SRC.jwDemo1, stream_icon: logo("H24", "0f172a", "38bdf8"), epg_channel_id: "horizon24.news" },

  // --- Kids & Animation (Big Buck Bunny footage) ---
  { num: 4, name: "Bubblegum Burrow TV", stream_id: 105, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("BB", "fbbf24", "1e1b4b"), epg_channel_id: "bubblegum.kids" },
  { num: 5, name: "Snickerdoodle Cartoons", stream_id: 106, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("SC", "fbbf24", "1e1b4b"), epg_channel_id: "snickerdoodle.kids" },
  { num: 6, name: "Rascal Ridge Kids", stream_id: 107, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("RR", "fbbf24", "1e1b4b"), epg_channel_id: "rascalridge.kids" },
  { num: 7, name: "Giggle Grove Junior", stream_id: 108, category_id: "2", source: SRC.bbbAdaptive, stream_icon: logo("GG", "fbbf24", "1e1b4b"), epg_channel_id: "gigglegrove.kids" },

  // --- Sci-Fi & Fantasy (Tears of Steel / Sintel footage) ---
  { num: 8, name: "Ironclad Sci-Fi Network", stream_id: 109, category_id: "3", source: SRC.tearsOfSteelHls, stream_icon: logo("IC", "1e1b4b", "a78bfa"), epg_channel_id: "ironclad.scifi" },
  { num: 9, name: "Nebula Nine TV", stream_id: 110, category_id: "3", source: SRC.tearsOfSteelHls, stream_icon: logo("N9", "1e1b4b", "a78bfa"), epg_channel_id: "nebulanine.scifi" },
  { num: 10, name: "Quantum Reel Channel", stream_id: 111, category_id: "3", source: SRC.tearsOfSteelHls, stream_icon: logo("QR", "1e1b4b", "a78bfa"), epg_channel_id: "quantumreel.scifi" },
  { num: 11, name: "Dragonglass Fantasy TV", stream_id: 112, category_id: "3", source: SRC.sintel, stream_icon: logo("DF", "14532d", "fde047"), epg_channel_id: "dragonglass.fantasy" },
  { num: 12, name: "Mythwood Channel", stream_id: 113, category_id: "3", source: SRC.sintel, stream_icon: logo("MW", "14532d", "fde047"), epg_channel_id: "mythwood.fantasy" },
  { num: 13, name: "Ember & Ash Network", stream_id: 114, category_id: "3", source: SRC.sintel, stream_icon: logo("EA", "14532d", "fde047"), epg_channel_id: "emberash.fantasy" },

  // --- Arts & Culture (Elephants Dream footage) ---
  { num: 14, name: "Velvet Static Arts", stream_id: 115, category_id: "4", source: SRC.elephantsDream, stream_icon: logo("VS", "27272a", "f472b6"), epg_channel_id: "velvetstatic.arts" },
  { num: 15, name: "Obscura Vision TV", stream_id: 116, category_id: "4", source: SRC.elephantsDream, stream_icon: logo("OV", "27272a", "f472b6"), epg_channel_id: "obscuravision.arts" },

  // --- Retro & Classic TV (BipBop test-pattern footage, styled as retro) ---
  { num: 16, name: "Classic Frame TV", stream_id: 117, category_id: "5", source: SRC.bipbop4x3, stream_icon: logo("CF", "78350f", "fef3c7"), epg_channel_id: "classicframe.retro" },
  { num: 17, name: "Vintage Vault Network", stream_id: 118, category_id: "5", source: SRC.bipbop4x3, stream_icon: logo("VV", "78350f", "fef3c7"), epg_channel_id: "vintagevault.retro" },
  { num: 18, name: "Retro Ray TV", stream_id: 119, category_id: "5", source: SRC.bipbop16x9, stream_icon: logo("RR", "78350f", "fef3c7"), epg_channel_id: "retroray.retro" },

  // --- Test Pattern Network ---
  { num: 19, name: "SignalCheck Prime", stream_id: 120, category_id: "6", source: SRC.bipbopAdvFmp4, stream_icon: logo("SC", "111827", "ef4444"), epg_channel_id: "signalcheck.test" },
  { num: 20, name: "Waveform Test Network", stream_id: 121, category_id: "6", source: SRC.akamaiTest1, stream_icon: logo("WF", "111827", "ef4444"), epg_channel_id: "waveform.test" },
  { num: 21, name: "Circuit City Broadcast", stream_id: 122, category_id: "6", source: SRC.akamaiTest2, stream_icon: logo("CC", "111827", "ef4444"), epg_channel_id: "circuitcity.test" },

  // --- Documentary & Nature ---
  { num: 22, name: "UltraVision 4K", stream_id: 124, category_id: "7", source: SRC.mux4k, stream_icon: logo("U4", "164e63", "5eead4"), epg_channel_id: "ultravision.docs" },
  { num: 23, name: "Crystal Clarity Network", stream_id: 125, category_id: "7", source: SRC.mux4k, stream_icon: logo("CC", "164e63", "5eead4"), epg_channel_id: "crystalclarity.docs" },
  { num: 24, name: "Deep Earth Explorers", stream_id: 133, category_id: "7", source: SRC.historicPlanet, stream_icon: logo("DE", "164e63", "5eead4"), epg_channel_id: "deepearth.docs" },

  // --- Music & Nightlife ---
  { num: 25, name: "Harborlight Broadcasting", stream_id: 126, category_id: "8", source: SRC.jwDemo1, stream_icon: logo("HB", "581c87", "f0abfc"), epg_channel_id: "harborlight.music" },
  { num: 26, name: "Lantern Bay TV", stream_id: 127, category_id: "8", source: SRC.jwDemo2, stream_icon: logo("LB", "581c87", "f0abfc"), epg_channel_id: "lanternbay.music" },
  { num: 27, name: "Metro Wave TV", stream_id: 128, category_id: "8", source: SRC.akamaiTest2, stream_icon: logo("MW", "581c87", "f0abfc"), epg_channel_id: "metrowave.music" },
  { num: 28, name: "Downtown Live Network", stream_id: 129, category_id: "8", source: SRC.akamaiTest1, stream_icon: logo("DL", "581c87", "f0abfc"), epg_channel_id: "downtownlive.music" },

  // --- Sports & Action (new skate 4K source) ---
  { num: 29, name: "Vertigo Extreme Sports", stream_id: 134, category_id: "9", source: SRC.skate4k, stream_icon: logo("VX", "7c2d12", "fed7aa"), epg_channel_id: "vertigo.sports" },
  { num: 30, name: "Concrete Wave Network", stream_id: 135, category_id: "9", source: SRC.skate4k, stream_icon: logo("CW", "7c2d12", "fed7aa"), epg_channel_id: "concretewave.sports" },
];

module.exports = { liveCategories, liveStreams };
