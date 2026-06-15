const express = require('express');
const axios = require('axios');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/pricing/:slug — fetch Steam price for a game
router.get('/:slug', async (req, res) => {
  try {
    const game = await prisma.game.findUnique({
      where: { slug: req.params.slug },
      select: { steamAppId: true, stores: true },
    });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Try to get Steam App ID from stored field or extract from store URLs
    let steamAppId = game.steamAppId;

    if (!steamAppId && Array.isArray(game.stores)) {
      const steamStore = game.stores.find((s) => s.slug === 'steam' || s.name?.toLowerCase() === 'steam');
      if (steamStore?.url) {
        const match = steamStore.url.match(/\/app\/(\d+)/);
        if (match) steamAppId = parseInt(match[1]);
      }
    }

    if (!steamAppId) {
      return res.json({ available: false, reason: 'No Steam listing found' });
    }

    const { data } = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us&filters=price_overview`,
      { timeout: 5000 }
    );

    const appData = data?.[steamAppId];
    if (!appData?.success) return res.json({ available: false, steamAppId });

    const price = appData.data?.price_overview;
    if (!price) return res.json({ available: true, steamAppId, free: true });

    res.json({
      available: true,
      steamAppId,
      steamUrl: `https://store.steampowered.com/app/${steamAppId}`,
      currency: price.currency,
      initial: price.initial / 100,
      final: price.final / 100,
      discountPercent: price.discount_percent,
      initialFormatted: price.initial_formatted,
      finalFormatted: price.final_formatted,
      onSale: price.discount_percent > 0,
    });
  } catch (err) {
    console.error('Pricing error:', err.message);
    res.json({ available: false, reason: 'Failed to fetch pricing' });
  }
});

module.exports = router;
