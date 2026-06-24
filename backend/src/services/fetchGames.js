require('dotenv').config();
const axios = require('axios');
const prisma = require('../lib/prisma');

const RAWG_KEY = process.env.RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

async function getNextPage() {
  const config = await prisma.config.findUnique({ where: { key: 'lastFetchedPage' } });
  return config ? parseInt(config.value) + 1 : 1;
}

async function saveNextPage(page) {
  await prisma.config.upsert({
    where: { key: 'lastFetchedPage' },
    update: { value: String(page) },
    create: { key: 'lastFetchedPage', value: String(page) },
  });
}

async function fetchAndStoreGames(page, pageSize = 34, ordering = '-added', { minAdded = 0, requireImage = false } = {}) {
  console.log(`Fetching RAWG page ${page} (${pageSize} games, ordering ${ordering})...`);

  const { data } = await axios.get(`${BASE_URL}/games`, {
    params: { key: RAWG_KEY, page, page_size: pageSize, ordering },
  });

  let saved = 0;

  for (const game of data.results) {
    try {
      // Quality gate — drops shovelware/test entries (only used by the special flow).
      if ((game.added || 0) < minAdded) continue;
      if (requireImage && !game.background_image) continue;

      // Skip games already stored — avoids wasting RAWG detail/screenshot calls.
      const existing = await prisma.game.findUnique({
        where: { rawgId: game.id },
        select: { id: true },
      });
      if (existing) continue;

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
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      console.error(`Failed to save game ${game.id}:`, err.message);
    }
  }

  console.log(`Saved ${saved} games from page ${page}`);
  return saved;
}

async function fetchHundredGames() {
  const startPage = await getNextPage();
  let total = 0;

  for (let i = 0; i < 3; i++) {
    const page = startPage + i;
    total += await fetchAndStoreGames(page, 34);
    await saveNextPage(page);
  }

  console.log(`Total games saved: ${total}. Next run starts at page ${startPage + 3}.`);
  process.exit(0);
}

// Only auto-run when invoked directly (node fetchGames.js), not when required.
if (require.main === module) {
  fetchHundredGames().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { fetchAndStoreGames, getNextPage, saveNextPage };
