const express = require("express");
const router = express.Router();
const { requireAuth } = require("../lib/auth");
const { liveCategories, liveStreams } = require("../data/live");
const { vodCategories, vodStreams } = require("../data/movies");
const { seriesCategories, series } = require("../data/series");
const { getShortEpgForChannel } = require("../lib/epg");
const { getPublicUrl } = require("../lib/publicUrl");

// Our generated posters are stored as relative paths ("/posters/x.svg") in
// data files; external logos (dummyimage.com, etc.) are already absolute
// URLs. This resolves only the relative ones against the server's actual
// public URL, so it works the same on localhost, LAN, or once deployed.
function resolveUrl(maybeRelative) {
  if (!maybeRelative) return maybeRelative;
  if (maybeRelative.startsWith("/")) return getPublicUrl().base + maybeRelative;
  return maybeRelative;
}

function withResolvedIcon(item) {
  return { ...item, stream_icon: resolveUrl(item.stream_icon) };
}

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
      return res.json(stripSource(filtered).map(withResolvedIcon));
    }

    case "get_vod_categories":
      return res.json(vodCategories);

    case "get_vod_streams": {
      const { category_id } = req.query;
      const filtered = category_id
        ? vodStreams.filter((s) => s.category_id === category_id)
        : vodStreams;
      return res.json(stripSource(filtered).map(withResolvedIcon));
    }

    case "get_vod_info": {
      const streamId = Number(req.query.vod_id);
      const movie = vodStreams.find((s) => s.stream_id === streamId);
      if (!movie) return res.status(404).json({ error: "not found" });
      return res.json({
        info: {
          name: movie.name,
          plot: movie.plot,
          cast: movie.cast,
          director: movie.director,
          studio: movie.studio,
          tech_note: movie.tech_note,
          rating: movie.rating,
          releasedate: movie.releasedate,
          cover_big: resolveUrl(movie.stream_icon),
        },
        movie_data: withResolvedIcon(stripSource([movie])[0]),
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
          cover: resolveUrl(s.cover),
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
          cover: resolveUrl(show.cover),
          cast: show.cast,
          director: show.director,
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
