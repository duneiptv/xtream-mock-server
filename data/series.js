// Series/episodes - fictional shows layered on top of the same verified
// Archive.org sources used in data/movies.js. All show names, episode
// titles, and cast below are invented.

const seriesCategories = [
  { category_id: "20", category_name: "Demo Series", parent_id: 0 },
  { category_id: "21", category_name: "Fantasy & Sci-Fi Series", parent_id: 0 },
];

function poster(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/600`;
}

const SRC = {
  elephantsDream: "https://archive.org/download/Sintel_201709/Elephants%20Dream.mp4",
  tearsOfSteel: "https://archive.org/download/Sintel_201709/Tears%20of%20Steel.mp4",
  sintel: "https://archive.org/download/Sintel_201709/Sintel.mp4",
  bbb: "https://archive.org/download/Sintel_201709/Big%20Buck%20Bunny.mp4",
};

const series = [
  {
    series_id: 300,
    name: "Learning IPTV",
    category_id: "20",
    cover: poster("learning-iptv"),
    plot: "A demo-only series for exercising your app's series/season/episode UI.",
    releaseDate: "2026-01-01",
    rating: "8.0",
    cast: "Various",
    director: "Various",
    seasons: [
      {
        season_number: 1,
        episodes: [
          { id: 3001, episode_num: 1, title: "Episode 1 - Pilot", container_extension: "mp4", source: SRC.elephantsDream, duration: "00:10:53" },
          { id: 3002, episode_num: 2, title: "Episode 2 - Rising Action", container_extension: "mp4", source: SRC.tearsOfSteel, duration: "00:12:14" },
          { id: 3003, episode_num: 3, title: "Episode 3 - Finale", container_extension: "mp4", source: SRC.sintel, duration: "00:14:48" },
        ],
      },
    ],
  },
  {
    series_id: 301,
    name: "The Kriek Files",
    category_id: "21",
    cover: poster("kriek-files-series"),
    plot: "A disbanded task force reunites one final time to investigate the machine uprising that ended their careers - and nearly ended everything else.",
    releaseDate: "2021-03-01",
    rating: "7.8",
    cast: "Rowan Achebe, Talia Delacroix, Magnus Falk, Clara Bergström",
    director: "Felix Odara",
    seasons: [
      {
        season_number: 1,
        episodes: [
          { id: 3011, episode_num: 1, title: "S01E01 - Reactivation", container_extension: "mp4", source: SRC.tearsOfSteel, duration: "00:12:14" },
          { id: 3012, episode_num: 2, title: "S01E02 - The Vault Beneath", container_extension: "mp4", source: SRC.tearsOfSteel, duration: "00:12:14" },
          { id: 3013, episode_num: 3, title: "S01E03 - What Kriek Knew", container_extension: "mp4", source: SRC.tearsOfSteel, duration: "00:12:14" },
        ],
      },
      {
        season_number: 2,
        episodes: [
          { id: 3021, episode_num: 1, title: "S02E01 - New Directive", container_extension: "mp4", source: SRC.tearsOfSteel, duration: "00:12:14" },
          { id: 3022, episode_num: 2, title: "S02E02 - Fault Lines", container_extension: "mp4", source: SRC.tearsOfSteel, duration: "00:12:14" },
        ],
      },
    ],
  },
  {
    series_id: 302,
    name: "Mythwood Tales",
    category_id: "21",
    cover: poster("mythwood-tales-series"),
    plot: "Anthology series following different wanderers through the same scarred, dragon-haunted world - each episode a self-contained story of loss and searching.",
    releaseDate: "2022-09-10",
    rating: "8.2",
    cast: "Elena Voss, Soren Beaumont, Anika Petrov, Kaia Munro, Baxter Falk",
    director: "Julian Marsh",
    seasons: [
      {
        season_number: 1,
        episodes: [
          { id: 3031, episode_num: 1, title: "S01E01 - The Hunter's Ledger", container_extension: "mp4", source: SRC.sintel, duration: "00:14:48" },
          { id: 3032, episode_num: 2, title: "S01E02 - Whitecliff Nights", container_extension: "mp4", source: SRC.sintel, duration: "00:14:48" },
          { id: 3033, episode_num: 3, title: "S01E03 - What the Wyrm Remembers", container_extension: "mp4", source: SRC.sintel, duration: "00:14:48" },
          { id: 3034, episode_num: 4, title: "S01E04 - Ashfall", container_extension: "mp4", source: SRC.sintel, duration: "00:14:48" },
        ],
      },
    ],
  },
  {
    series_id: 303,
    name: "Bramblewood Kids",
    category_id: "20",
    cover: poster("bramblewood-kids-series"),
    plot: "The Saturday-morning spin-off - shorter, sillier episodes following the meadow crew's day-to-day misadventures.",
    releaseDate: "2023-06-01",
    rating: "7.5",
    cast: "Noor Hartley, Magnus Falk, Talia Delacroix",
    director: "Idris Okonkwo",
    seasons: [
      {
        season_number: 1,
        episodes: [
          { id: 3041, episode_num: 1, title: "S01E01 - Morning Mischief", container_extension: "mp4", source: SRC.bbb, duration: "00:09:56" },
          { id: 3042, episode_num: 2, title: "S01E02 - The Great Acorn Heist", container_extension: "mp4", source: SRC.bbb, duration: "00:09:56" },
          { id: 3043, episode_num: 3, title: "S01E03 - Rodents on the Run", container_extension: "mp4", source: SRC.bbb, duration: "00:09:56" },
        ],
      },
    ],
  },
];

module.exports = { seriesCategories, series };
