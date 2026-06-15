require('dotenv').config();
const axios = require('axios');
const prisma = require('../lib/prisma');

const RAWG_KEY = process.env.RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

async function fetchAndStoreGames(page = 1, pageSize = 40) {
  console.log(`Fetching RAWG page ${page} (${pageSize} games)...`);

  const { data } = await axios.get(`${BASE_URL}/games`, {
    params: {
      key: RAWG_KEY,
      page,
      page_size: pageSize,
      ordering: '-added',
    },
  });

  let saved = 0;

  for (const game of data.results) {
    try {
      // Fetch full detail for description + system requirements
      const { data: detail } = await axios.get(`${BASE_URL}/games/${game.id}`, {
        params: { key: RAWG_KEY },
      });

      const platforms = detail.platforms?.map((p) => ({
        name: p.platform.name,
        slug: p.platform.slug,
        requirements: p.requirements,
      })) || [];

      const systemRequirements = platforms.reduce((acc, p) => {
        if (p.requirements && Object.keys(p.requirements).length > 0) {
          acc[p.slug] = p.requirements;
        }
        return acc;
      }, {});

      // Fetch screenshots
      const { data: ssData } = await axios.get(`${BASE_URL}/games/${game.id}/screenshots`, {
        params: { key: RAWG_KEY },
      });

      await prisma.game.upsert({
        where: { rawgId: game.id },
        update: {},
        create: {
          rawgId: game.id,
          slug: detail.slug,
          name: detail.name,
          description: detail.description_raw,
          released: detail.released,
          backgroundImage: detail.background_image,
          rating: detail.rating,
          ratingTop: detail.rating_top,
          ratingsCount: detail.ratings_count,
          metacritic: detail.metacritic,
          playtime: detail.playtime,
          genres: detail.genres?.map((g) => ({ id: g.id, name: g.name, slug: g.slug })),
          platforms,
          screenshots: ssData.results?.map((s) => s.image),
          stores: detail.stores?.map((s) => ({ name: s.store.name, slug: s.store.slug, url: s.url })),
          developers: detail.developers?.map((d) => ({ id: d.id, name: d.name })),
          publishers: detail.publishers?.map((p) => ({ id: p.id, name: p.name })),
          tags: detail.tags?.slice(0, 10).map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
          esrbRating: detail.esrb_rating?.name,
          website: detail.website,
          systemRequirements,
        },
      });

      saved++;
      // Respect RAWG rate limit
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      console.error(`Failed to save game ${game.id}:`, err.message);
    }
  }

  console.log(`Saved ${saved} games from page ${page}`);
  return saved;
}

async function fetchHundredGames() {
  let total = 0;
  // Fetch 3 pages of 34 games each ≈ 102 games
  for (let page = 1; page <= 3; page++) {
    total += await fetchAndStoreGames(page, 34);
  }
  console.log(`Total games saved: ${total}`);
  process.exit(0);
}

fetchHundredGames().catch((err) => {
  console.error(err);
  process.exit(1);
});
