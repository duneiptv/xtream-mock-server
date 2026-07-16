// VOD "movies" - fictional titles/cast layered on top of verified,
// confirmed-working sources. Each underlying source is reused under several
// invented movie identities. All titles, plots, cast, directors, and studio
// names are entirely invented - not real films, people, or companies.
//
// Posters are generated SVG artwork (see /public/posters, built by
// scripts/generate-posters.js) served from this app itself - not stock
// photos. Paths here are relative ("/posters/x.svg"); player_api.js resolves
// them to full URLs at request time via lib/publicUrl.js.

const vodCategories = [
  { category_id: "10", category_name: "Animated Adventures", parent_id: 0 },
  { category_id: "11", category_name: "Science Fiction", parent_id: 0 },
  { category_id: "12", category_name: "Fantasy Epics", parent_id: 0 },
  { category_id: "13", category_name: "Arthouse and Experimental", parent_id: 0 },
  { category_id: "14", category_name: "Multi-Audio and Subtitle Test Clips", parent_id: 0 },
  { category_id: "15", category_name: "Dark Comedy", parent_id: 0 },
  { category_id: "16", category_name: "Studio Archive Reels", parent_id: 0 },
  { category_id: "17", category_name: "Documentary", parent_id: 0 },
];

function poster(slug) {
  return `/posters/${slug}.svg`;
}

const SRC = {
  bbb: "https://archive.org/download/Sintel_201709/Big%20Buck%20Bunny.mp4",
  bbbHls: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  elephantsDream: "https://archive.org/download/Sintel_201709/Elephants%20Dream.mp4",
  sintel: "https://archive.org/download/Sintel_201709/Sintel.mp4",
  tearsOfSteel: "https://archive.org/download/Sintel_201709/Tears%20of%20Steel.mp4",
  tearsOfSteelHoh: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel-hoh-subs.ism/.m3u8",
  tearsOfSteelImsc: "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  cosmosLaundromat: "https://archive.org/download/Sintel_201709/Cosmos%20Laundromat.mp4",
  bipbopAdvFmp4: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
  bipbop16x9: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8",
  bipbop4x3: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8",
  bipbopHevc: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8",
  muxDai: "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  advDvAtmos: "https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8",
};

const STUDIOS = ["Lumen Peak Studios", "Northlight Pictures", "Obsidian Frame Films", "Wanderlight Media", "Cobalt Owl Studios", "Driftwood Cinema Co.", "Half Moon Films", "Amberlyn Pictures", "Thistle & Vine Productions", "Graymantle Studios"];

const vodStreams = [
  // --- Animated Adventures (Big Buck Bunny footage) ---
  { num: 1, name: "Thistledown and the Forest Bandits", stream_id: 200, category_id: "10", container_extension: "mp4", source: SRC.bbb, stream_icon: poster("thistledown-bandits"), plot: "A good-natured woodland giant is pushed too far by a trio of mischievous forest bandits, and decides enough is enough.", cast: "Desmond Kray, Naomi Kessler, Felix Odara", director: "Ingrid Solheim", studio: STUDIOS[0], rating: "7.6", releasedate: "2019-05-03" },
  { num: 2, name: "Buster's Big Payback", stream_id: 201, category_id: "10", container_extension: "mp4", source: SRC.bbb, stream_icon: poster("busters-payback"), plot: "After a season of endless pranks, a mild-mannered meadow dweller finally hatches a plan of his own.", cast: "Marcus Idowu, Clara Bergström, Rowan Achebe", director: "Tobias Renn", studio: STUDIOS[4], rating: "7.1", releasedate: "2020-11-14" },
  { num: 3, name: "The Meadow King's Revenge", stream_id: 202, category_id: "10", container_extension: "mp4", source: SRC.bbb, stream_icon: poster("meadow-king-revenge"), plot: "The unofficial ruler of a quiet meadow finally stands up to the rodents who've ruled the underbrush by intimidation for years.", cast: "Yusuf Achebe, Freya Lindqvist, Callum Beaumont", director: "Petra Vasilenko", studio: STUDIOS[7], rating: "6.9", releasedate: "2021-03-22" },
  { num: 4, name: "Bramblewood Chronicles: Origins", stream_id: 203, category_id: "10", container_extension: "mp4", source: SRC.bbb, stream_icon: poster("bramblewood-origins"), plot: "Before the legends, there was just a rabbit trying to have a peaceful morning.", cast: "Noor Hartley, Magnus Falk, Talia Delacroix", director: "Idris Okonkwo", studio: STUDIOS[2], rating: "7.4", releasedate: "2022-08-09" },
  { num: 5, name: "Bramblewood Chronicles: Director's Cut", stream_id: 209, category_id: "10", container_extension: "m3u8", source: SRC.bbbHls, stream_icon: poster("bramblewood-directors-cut"), plot: "The extended cut, with 40 additional seconds of forest ambience the studio insisted were essential.", cast: "Noor Hartley, Magnus Falk, Talia Delacroix", director: "Idris Okonkwo", studio: STUDIOS[2], rating: "7.5", releasedate: "2022-12-01" },
  { num: 6, name: "Thistledown Redux", stream_id: 210, category_id: "10", container_extension: "m3u8", source: SRC.bbbHls, stream_icon: poster("thistledown-redux"), plot: "A remastered re-release of the forest-bandit saga, now in adaptive bitrate for the streaming generation.", cast: "Desmond Kray, Naomi Kessler, Felix Odara", director: "Ingrid Solheim", studio: STUDIOS[0], rating: "7.6", releasedate: "2023-02-17" },

  // --- Fantasy Epics (Sintel footage) ---
  { num: 7, name: "The Dragonhunter's Lament", stream_id: 204, category_id: "12", container_extension: "mp4", source: SRC.sintel, stream_icon: poster("dragonhunters-lament"), plot: "A weathered wanderer crosses a scarred, wintry world searching for a creature she lost long ago.", cast: "Elena Voss, Soren Beaumont, Anika Petrov", director: "Julian Marsh", studio: STUDIOS[6], rating: "8.1", releasedate: "2018-10-11" },
  { num: 8, name: "Wings of Ash", stream_id: 205, category_id: "12", container_extension: "mp4", source: SRC.sintel, stream_icon: poster("wings-of-ash"), plot: "In a land scorched by an ancient war between wyrms and wanderers, one traveler refuses to let go of what she's lost.", cast: "Kaia Munro, Baxter Falk, Selene Okonkwo", director: "Osric Thorne", studio: STUDIOS[9], rating: "7.9", releasedate: "2019-06-28" },
  { num: 9, name: "Whitecliff: A Hunter's Tale", stream_id: 206, category_id: "12", container_extension: "mp4", source: SRC.sintel, stream_icon: poster("whitecliff-hunters-tale"), plot: "High above the frostline, a lone hunter's search for a missing companion becomes a reckoning with everything she's sacrificed.", cast: "Junko Adeyemi, Dario Castellano, Liv Björk", director: "Priya Anand", studio: STUDIOS[3], rating: "8.0", releasedate: "2020-01-17" },
  { num: 10, name: "The Last Wyrmrider", stream_id: 207, category_id: "12", container_extension: "mp4", source: SRC.sintel, stream_icon: poster("last-wyrmrider"), plot: "The final entry in the Wyrmrider saga follows one woman's journey through a broken, beautiful wasteland to find what's left of home.", cast: "Elena Voss, Ingrid Solheim, Marcus Idowu", director: "Naomi Kessler", studio: STUDIOS[6], rating: "8.3", releasedate: "2023-09-30" },

  // --- Science Fiction (Tears of Steel footage) ---
  { num: 11, name: "Iron Requiem", stream_id: 208, category_id: "11", container_extension: "mp4", source: SRC.tearsOfSteel, stream_icon: poster("iron-requiem"), plot: "Decades after a catastrophic uprising of military machines, a small team of engineers returns to the ruins to reclaim what was lost.", cast: "Tobias Renn, Freya Lindqvist, Callum Beaumont", director: "Felix Odara", studio: STUDIOS[8], rating: "7.3", releasedate: "2017-11-02" },
  { num: 12, name: "The Kriek Directive", stream_id: 211, category_id: "11", container_extension: "mp4", source: SRC.tearsOfSteel, stream_icon: poster("kriek-directive"), plot: "A disavowed scientist races to stop her former colleagues from reactivating a weapon she swore she'd destroyed.", cast: "Rowan Achebe, Talia Delacroix, Magnus Falk", director: "Clara Bergström", studio: STUDIOS[1], rating: "7.0", releasedate: "2018-04-19" },
  { num: 13, name: "Steelbound: Reclamation", stream_id: 212, category_id: "11", container_extension: "mp4", source: SRC.tearsOfSteel, stream_icon: poster("steelbound-reclamation"), plot: "In the rusted skeleton of a fallen city, a reluctant crew of scavengers finds something that shouldn't still be running.", cast: "Idris Okonkwo, Noor Hartley, Petra Vasilenko", director: "Yusuf Achebe", studio: STUDIOS[5], rating: "6.8", releasedate: "2019-02-08" },
  { num: 14, name: "Vertex Protocol", stream_id: 213, category_id: "11", container_extension: "mp4", source: SRC.tearsOfSteel, stream_icon: poster("vertex-protocol"), plot: "A signal from an abandoned research tower draws a small team back into the war they thought they'd already lost.", cast: "Baxter Falk, Kaia Munro, Selene Okonkwo", director: "Dario Castellano", studio: STUDIOS[4], rating: "7.2", releasedate: "2021-07-25" },

  // --- Dark Comedy (Cosmos Laundromat footage) ---
  { num: 15, name: "Wool and Consequence", stream_id: 214, category_id: "15", container_extension: "mp4", source: SRC.cosmosLaundromat, stream_icon: poster("wool-and-consequence"), plot: "A deeply unhappy sheep is offered one wish by a mysterious stranger, and immediately regrets asking for it.", cast: "Osric Thorne, Junko Adeyemi, Liv Björk", director: "Anika Petrov", studio: STUDIOS[2], rating: "7.4", releasedate: "2020-05-14" },
  { num: 16, name: "The Existential Sheep", stream_id: 215, category_id: "15", container_extension: "mp4", source: SRC.cosmosLaundromat, stream_icon: poster("existential-sheep"), plot: "A midlife-crisis comedy for the barnyard set - one sheep, one bad decision, and a stranger with an agenda.", cast: "Dario Castellano, Elena Voss, Soren Beaumont", director: "Marcus Idowu", studio: STUDIOS[6], rating: "7.0", releasedate: "2021-10-01" },
  { num: 17, name: "Franck's Last Stand", stream_id: 216, category_id: "15", container_extension: "mp4", source: SRC.cosmosLaundromat, stream_icon: poster("francks-last-stand"), plot: "One sheep. One very bad week. A darkly funny character study on the perils of getting exactly what you asked for.", cast: "Naomi Kessler, Felix Odara, Ingrid Solheim", director: "Julian Marsh", studio: STUDIOS[9], rating: "7.3", releasedate: "2022-06-06" },

  // --- Arthouse and Experimental (Elephants Dream footage) ---
  { num: 18, name: "The Cognition Engine", stream_id: 217, category_id: "13", container_extension: "mp4", source: SRC.elephantsDream, stream_icon: poster("cognition-engine"), plot: "Two figures navigate an impossible, shifting mechanical world that may or may not be a shared memory.", cast: "Clara Bergström, Rowan Achebe, Talia Delacroix", director: "Kaia Munro", studio: STUDIOS[7], rating: "6.7", releasedate: "2016-09-15" },
  { num: 19, name: "Labyrinth of Rusted Thought", stream_id: 218, category_id: "13", container_extension: "mp4", source: SRC.elephantsDream, stream_icon: poster("labyrinth-rusted-thought"), plot: "An unsettling, dreamlike journey through the machinery of a mind that no longer trusts itself.", cast: "Priya Anand, Julian Marsh, Naomi Kessler", director: "Baxter Falk", studio: STUDIOS[3], rating: "6.5", releasedate: "2017-01-20" },
  { num: 20, name: "Static Cathedral", stream_id: 219, category_id: "13", container_extension: "mp4", source: SRC.elephantsDream, stream_icon: poster("static-cathedral"), plot: "A hypnotic, wordless descent through a cathedral built entirely of noise and machinery.", cast: "Selene Okonkwo, Osric Thorne, Junko Adeyemi", director: "Liv Björk", studio: STUDIOS[8], rating: "6.9", releasedate: "2018-03-11" },

  // --- Studio Archive Reels (test-pattern footage, in-universe archival framing) ---
  { num: 21, name: "Studio Frame 7: Calibration", stream_id: 220, category_id: "16", container_extension: "m3u8", source: SRC.bipbopAdvFmp4, stream_icon: poster("studio-frame-7"), plot: "A recovered calibration reel from a defunct broadcast studio - color bars, tone, and the strange calm of a signal with nothing to say.", cast: "Archival material - no credited cast", director: "Unknown", studio: "Graymantle Archive Division", rating: "n/a", releasedate: "1998-01-01" },
  { num: 22, name: "Archive Reel No. 12", stream_id: 221, category_id: "16", container_extension: "m3u8", source: SRC.muxDai, stream_icon: poster("archive-reel-12"), plot: "A patched-together broadcast reel with a visible splice where an advertisement break was cut for time.", cast: "Archival material - no credited cast", director: "Unknown", studio: "Graymantle Archive Division", rating: "n/a", releasedate: "2001-06-14" },
  { num: 23, name: "Broadcast Relic 4x3", stream_id: 222, category_id: "16", container_extension: "m3u8", source: SRC.bipbop4x3, stream_icon: poster("broadcast-relic-4x3"), plot: "Recovered from a station's tape vault before the transition to widescreen.", cast: "Archival material - no credited cast", director: "Unknown", studio: "Graymantle Archive Division", rating: "n/a", releasedate: "1994-11-02" },

  // --- Documentary (new historic-planet source) ---
  { num: 24, name: "Wild Meadow: A Season in the Grass", stream_id: 226, category_id: "17", container_extension: "mp4", source: SRC.bbb, stream_icon: poster("wild-meadow-season"), plot: "A quiet, observational documentary following a single meadow through a full season of change, from first thaw to first frost.", cast: "Narrated by Ingrid Solheim", director: "Petra Vasilenko", studio: STUDIOS[1], rating: "8.1", releasedate: "2023-05-14" },
  { num: 25, name: "The Last Broadcast Tower", stream_id: 227, category_id: "17", container_extension: "m3u8", source: SRC.bipbop4x3, stream_icon: poster("last-broadcast-tower"), plot: "A short documentary on the final years of a regional analog broadcast tower before it was decommissioned - interviews with the engineers who kept it running.", cast: "Featuring: Callum Beaumont, Kaia Munro", director: "Dario Castellano", studio: STUDIOS[5], rating: "7.6", releasedate: "2022-11-20" },

  // --- Multi-Audio and Subtitle Test Clips (genuinely verified multi-track sources) ---
  { num: 26, name: "Two Voices: One Frame", stream_id: 223, category_id: "14", container_extension: "m3u8", source: SRC.bipbop16x9, stream_icon: poster("two-voices-one-frame"), plot: "A dual-narration piece designed to be experienced twice - once in each of its two audio tracks - with optional subtitles for both cuts.", cast: "Voice work: Dario Castellano, Kaia Munro", director: "Selene Okonkwo", studio: STUDIOS[5], rating: "n/a", releasedate: "2020-01-01", tech_note: "2 selectable audio renditions + 2 English subtitle tracks (regular + forced)." },
  { num: 27, name: "Silent Frequency", stream_id: 224, category_id: "14", container_extension: "m3u8", source: SRC.bipbopHevc, stream_icon: poster("silent-frequency"), plot: "A minimalist piece built around what isn't said - captioned throughout for accessibility.", cast: "Archival material - no credited cast", director: "Unknown", studio: "Graymantle Archive Division", rating: "n/a", releasedate: "2020-01-01", tech_note: "HEVC codec, separate audio/video renditions, WebVTT subtitles." },
  { num: 28, name: "Iron Requiem: Accessible Cut", stream_id: 225, category_id: "14", container_extension: "m3u8", source: SRC.tearsOfSteelHoh, stream_icon: poster("iron-requiem-accessible"), plot: "The same reclamation story from Iron Requiem, repackaged with dedicated hard-of-hearing subtitle tracks.", cast: "Tobias Renn, Freya Lindqvist, Callum Beaumont", director: "Felix Odara", studio: STUDIOS[8], rating: "7.3", releasedate: "2023-04-12", tech_note: "Hard-of-hearing subtitle tracks (dialogue + non-speech audio cues)." },
  { num: 29, name: "Iron Requiem: Subtitled Archive Cut", stream_id: 228, category_id: "14", container_extension: "m3u8", source: SRC.tearsOfSteelImsc, stream_icon: poster("iron-requiem-imsc"), plot: "A third release of the Iron Requiem story, packaged with IMSC-format subtitles for testing standards-based caption rendering.", cast: "Tobias Renn, Freya Lindqvist, Callum Beaumont", director: "Felix Odara", studio: STUDIOS[8], rating: "7.3", releasedate: "2023-08-01", tech_note: "IMSC (TTML-based) subtitle format, separate audio/video renditions." },
  { num: 30, name: "Atmos Rising", stream_id: 229, category_id: "14", container_extension: "m3u8", source: SRC.advDvAtmos, stream_icon: poster("atmos-rising"), plot: "A short-form showcase piece built specifically to exercise premium home-theater setups end to end.", cast: "Archival material - no credited cast", director: "Unknown", studio: "Graymantle Archive Division", rating: "n/a", releasedate: "2023-05-01", tech_note: "UHD with Dolby Vision video and multiple Dolby Digital/Dolby Atmos audio tracks, plus subtitle/CC tracks." },
];

module.exports = { vodCategories, vodStreams };
