const express = require("express");
const router = express.Router();
const { requireAuth } = require("../lib/auth");
const { liveCategories, liveStreams } = require("../data/live");
const { vodCategories, vodStreams } = require("../data/movies");
const { seriesCategories, series } = require("../data/series");
const { getShortEpgForChannel } = require("../lib/epg");

router.get("/player_api.php", requireAuth, (req, res) => {
  const { action } = req.query;

  // No action = login/handshake call. Real servers return user_info + server_info.
  if (!action) {
    return res.json({
      user_info: req.xtreamUserInfo,
      server_info: req.xtreamServerInfo,
    });
  }

  switch (action) {
    case "get_live_categories":
      return res.json(liveCategories);

    case "get_live_streams": {
      const { category_id } = req.query;
      const filtered = category_id
        ? liveStreams.filter((s) => s.category_id === category_id)
        : liveStreams;
      return res.json(stripSource(filtered));
    }

    case "get_vod_categories":
      return res.json(vodCategories);

    case "get_vod_streams": {
      const { category_id } = req.query;
      const filtered = category_id
        ? vodStreams.filter((s) => s.category_id === category_id)
        : vodStreams;
      return res.json(stripSource(filtered));
    }

    case "get_vod_info": {
      const streamId = Number(req.query.vod_id);
      const movie = vodStreams.find((s) => s.stream_id === streamId);
      if (!movie) return res.status(404).json({ error: "not found" });
      return res.json({
        info: {
          name: movie.name,
          plot: movie.plot,
          rating: movie.rating,
          releasedate: movie.releasedate,
          cover_big: movie.stream_icon,
        },
        movie_data: stripSource([movie])[0],
      });
    }

    case "get_series_categories":
      return res.json(seriesCategories);

    case "get_series": {
      const { category_id } = req.query;
      const filtered = category_id
        ? series.filter((s) => s.category_id === category_id)
        : series;
      return res.json(
        filtered.map((s) => ({
          series_id: s.series_id,
          name: s.name,
          category_id: s.category_id,
          cover: s.cover,
          plot: s.plot,
          releaseDate: s.releaseDate,
          rating: s.rating,
        }))
      );
    }

    case "get_series_info": {
      const seriesId = Number(req.query.series_id);
      const show = series.find((s) => s.series_id === seriesId);
      if (!show) return res.status(404).json({ error: "not found" });

      const episodesBySeason = {};
      show.seasons.forEach((season) => {
        episodesBySeason[season.season_number] = season.episodes.map((ep) => ({
          id: String(ep.id),
          episode_num: ep.episode_num,
          title: ep.title,
          container_extension: ep.container_extension,
          duration: ep.duration,
        }));
      });

      return res.json({
        info: {
          name: show.name,
          plot: show.plot,
          cover: show.cover,
          rating: show.rating,
          releaseDate: show.releaseDate,
        },
        episodes: episodesBySeason,
      });
    }

    case "get_short_epg": {
      const streamId = Number(req.query.stream_id);
      return res.json({ epg_listings: getShortEpgForChannel(streamId) });
    }

    default:
      return res.status(400).json({ error: `unsupported action: ${action}` });
  }
});

// Clients never need to see our internal `source` field - only the
// stream_id, which they use to build the play URL themselves.
function stripSource(items) {
  return items.map(({ source, ...rest }) => rest);
}

module.exports = router;
