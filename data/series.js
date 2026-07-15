// Series/episodes. Episode `source` values default to reusing the Blender
// Foundation clips so everything plays out-of-the-box with zero setup.
// Drop your own short clips into /media/series/ and point `source` at
// `/media/series/yourfile.mp4` to use real local files instead.

const seriesCategories = [
  { category_id: "20", category_name: "Demo Series", parent_id: 0 },
];

const series = [
  {
    series_id: 300,
    name: "Learning IPTV",
    category_id: "20",
    cover: "https://picsum.photos/seed/learningiptv/300/450",
    plot: "A demo-only series for exercising your app's series/season/episode UI.",
    releaseDate: "2026-01-01",
    rating: "8.0",
    seasons: [
      {
        season_number: 1,
        episodes: [
          {
            id: 3001,
            episode_num: 1,
            title: "Episode 1 - Pilot",
            container_extension: "mp4",
            source: "https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_720p_h264.mov",
            duration: "00:09:56",
          },
          {
            id: 3002,
            episode_num: 2,
            title: "Episode 2 - Rising Action",
            container_extension: "mp4",
            source: "https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_720p.mkv",
            duration: "00:12:14",
          },
          {
            id: 3003,
            episode_num: 3,
            title: "Episode 3 - Finale",
            container_extension: "mp4",
            source: "https://download.blender.org/durian/movies/sintel-1024-surround.mp4",
            duration: "00:14:48",
          },
        ],
      },
    ],
  },
];

module.exports = { seriesCategories, series };
