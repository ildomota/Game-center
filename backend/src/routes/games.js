const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// Sidebar "Platforms" filter — groups RAWG's many per-generation platform
// slugs (e.g. playstation4, playstation5) into the families shown in the UI.
const PLATFORM_GROUPS = {
  pc: ['pc'],
  playstation: ['playstation5', 'playstation4', 'playstation3', 'playstation2', 'ps-vita', 'psp'],
  xbox: ['xbox-series-x', 'xbox-one', 'xbox360', 'xbox-old'],
  'nintendo-switch': ['nintendo-switch', 'nintendo-3ds', 'nintendo-ds', 'wii-u', 'wii', 'gamecube'],
  ios: ['ios'],
  android: ['android'],
};

// GET /api/games — list with pagination, search, filter
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', genre = '', platform = '', ordering = '-rating', releasedFrom = '', releasedTo = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const platformSlugs = PLATFORM_GROUPS[platform];

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(genre && {
        genres: { array_contains: [{ name: genre }] }
      }),
      ...(platformSlugs && {
        OR: platformSlugs.map((slug) => ({ platforms: { array_contains: [{ slug }] } })),
      }),
      // released is a "YYYY-MM-DD" string — lexicographic comparison matches chronological order.
      ...((releasedFrom || releasedTo) && {
        released: {
          not: null,
          ...(releasedFrom && { gte: releasedFrom }),
          ...(releasedTo && { lte: releasedTo }),
        },
      }),
    };

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: ordering.startsWith('-')
          ? { [ordering.slice(1)]: 'desc' }
          : { [ordering]: 'asc' },
        select: {
          id: true,
          rawgId: true,
          slug: true,
          name: true,
          backgroundImage: true,
          rating: true,
          metacritic: true,
          released: true,
          genres: true,
          platforms: true,
          playtime: true,
          ratingsCount: true,
        },
      }),
      prisma.game.count({ where }),
    ]);

    res.json({
      results: games,
      count: total,
      next: skip + games.length < total ? parseInt(page) + 1 : null,
      previous: parseInt(page) > 1 ? parseInt(page) - 1 : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// GET /api/games/:slug — single game detail
router.get('/:slug', async (req, res) => {
  try {
    const game = await prisma.game.findUnique({ where: { slug: req.params.slug } });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

module.exports = router;
