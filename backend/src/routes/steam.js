const express = require('express');
const axios = require('axios');
const { resolveSteamAppId } = require('../lib/steam');

const router = express.Router();
const KEY = process.env.STEAM_API_KEY;

// GET /api/steam/:slug/players — live concurrent player count
router.get('/:slug/players', async (req, res) => {
  try {
    const { found, steamAppId } = await resolveSteamAppId(req.params.slug);
    if (!found) return res.status(404).json({ error: 'Game not found' });
    if (!steamAppId) return res.json({ available: false });

    const { data } = await axios.get(
      'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/',
      { params: { appid: steamAppId, key: KEY }, timeout: 5000 }
    );

    const result = data?.response;
    if (result?.result !== 1) return res.json({ available: false, steamAppId });

    res.json({ available: true, steamAppId, players: result.player_count });
  } catch (err) {
    console.error('Steam players error:', err.message);
    res.json({ available: false });
  }
});

// GET /api/steam/:slug/news — latest news / patch notes
router.get('/:slug/news', async (req, res) => {
  try {
    const { found, steamAppId } = await resolveSteamAppId(req.params.slug);
    if (!found) return res.status(404).json({ error: 'Game not found' });
    if (!steamAppId) return res.json({ available: false, items: [] });

    const { data } = await axios.get(
      'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/',
      {
        params: { appid: steamAppId, count: 5, maxlength: 300, key: KEY },
        timeout: 5000,
      }
    );

    const items = (data?.appnews?.newsitems || []).map((n) => ({
      gid: n.gid,
      title: n.title,
      url: n.url,
      author: n.author,
      contents: n.contents,
      feedLabel: n.feedlabel,
      date: n.date, // unix seconds
    }));

    res.json({ available: items.length > 0, steamAppId, items });
  } catch (err) {
    console.error('Steam news error:', err.message);
    res.json({ available: false, items: [] });
  }
});

// GET /api/steam/:slug/trailers — game trailers / videos
router.get('/:slug/trailers', async (req, res) => {
  try {
    const { found, steamAppId } = await resolveSteamAppId(req.params.slug);
    if (!found) return res.status(404).json({ error: 'Game not found' });
    if (!steamAppId) return res.json({ available: false, items: [] });

    const { data } = await axios.get(
      'https://store.steampowered.com/api/appdetails',
      { params: { appids: steamAppId, filters: 'movies', cc: 'us' }, timeout: 5000 }
    );

    const appData = data?.[steamAppId];
    if (!appData?.success) return res.json({ available: false, items: [] });

    const items = (appData.data?.movies || []).map((m) => ({
      id: m.id,
      name: m.name,
      thumbnail: m.thumbnail,
      mp4: m.mp4?.max || m.mp4?.['480'] || null,
      webm: m.webm?.max || m.webm?.['480'] || null,
      hls: m.hls_h264 || null,
    }));

    res.json({ available: items.length > 0, steamAppId, items });
  } catch (err) {
    console.error('Steam trailers error:', err.message);
    res.json({ available: false, items: [] });
  }
});

module.exports = router;
