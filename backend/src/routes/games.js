const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET /api/games — list with pagination, search, filter
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', genre = '', ordering = '-rating' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(genre && {
        genres: { path: '$[*].name', string_contains: genre }
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
