// VOD "movies" — Blender Foundation open movies (CC-BY licensed) are the
// most reliable long-term source: they're mirrored on archive.org and rarely
// go down, unlike random third-party demo CDNs.

const vodCategories = [
  { category_id: "10", category_name: "Blender Open Movies", parent_id: 0 },
  { category_id: "11", category_name: "Kids", parent_id: 0 },
];

const vodStreams = [
  {
    num: 1,
    name: "Big Buck Bunny (2008)",
    stream_type: "movie",
    stream_id: 200,
    stream_icon: "https://picsum.photos/seed/bbbposter/300/450",
    category_id: "10",
    container_extension: "mp4",
    source: "https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_720p_h264.mov",
    plot: "A giant rabbit deals with three bullying rodents. Creative Commons Attribution 3.0 — Blender Foundation.",
    rating: "7.8",
    releasedate: "2008-04-10",
  },
  {
    num: 2,
    name: "Sintel (2010)",
    stream_type: "movie",
    stream_id: 201,
    stream_icon: "https://picsum.photos/seed/sintelposter/300/450",
    category_id: "10",
    container_extension: "mp4",
    source: "https://download.blender.org/durian/movies/sintel-1024-surround.mp4",
    plot: "A lonely girl named Sintel hunts for a baby dragon. Creative Commons Attribution 3.0 — Blender Foundation.",
    rating: "7.8",
    releasedate: "2010-09-30",
  },
  {
    num: 3,
    name: "Tears of Steel (2012)",
    stream_type: "movie",
    stream_id: 202,
    stream_icon: "https://picsum.photos/seed/tosposter/300/450",
    category_id: "10",
    container_extension: "mp4",
    source: "https://mango.blender.org/wp-content/uploads/2013/05/tears_of_steel_720p.mkv",
    plot: "Sci-fi short about a group defending a museum from robots. Creative Commons Attribution 3.0 — Blender Foundation.",
    rating: "6.5",
    releasedate: "2012-09-26",
  },
  {
    num: 4,
    name: "Cosmos Laundromat (2015)",
    stream_type: "movie",
    stream_id: 203,
    stream_icon: "https://picsum.photos/seed/cosmosposter/300/450",
    category_id: "11",
    container_extension: "mp4",
    source: "https://download.blender.org/demo/movies/CosmosLaundromat/CosmosLaundromat_2015_16x9_2K.mp4",
    plot: "A suicidal sheep gets a chance to reconsider. Creative Commons Attribution 3.0 — Blender Foundation.",
    rating: "7.4",
    releasedate: "2015-08-01",
  },
];

module.exports = { vodCategories, vodStreams };
