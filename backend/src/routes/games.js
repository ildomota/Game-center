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

    // "trending" = released in the last ~6 months, most-rated first.
    // An explicit releasedFrom/releasedTo (New Releases links) still wins.
    const isTrending = ordering === 'trending';
    const today = new Date().toISOString().slice(0, 10);
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const from = releasedFrom || (isTrending ? sixMonthsAgo : '');
    const to = releasedTo || (isTrending ? today : '');

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(genre && {
        genres: { array_contains: [{ name: genre }] }
      }),
      ...(platformSlugs && {
        OR: platformSlugs.map((slug) => ({ platforms: { array_contains: [{ slug }] } })),
      }),
      // released is a "YYYY-MM-DD" string — lexicographic comparison matches chronological order.
      ...((from || to) && {
        released: { not: null, ...(from && { gte: from }), ...(to && { lte: to }) },
      }),
    };

    // nulls: 'last' — Postgres puts NULLs FIRST on desc sorts, so without this
    // "Best Metacritic" would start with games that have no score.
    const field = isTrending ? 'ratingsCount' : ordering.replace(/^-/, '');
    const dir = isTrending || ordering.startsWith('-') ? 'desc' : 'asc';
    const orderBy = [
      { [field]: { sort: dir, nulls: 'last' } },
      { released: { sort: 'desc', nulls: 'last' } }, // tie-breaker: newer first
    ];

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
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
