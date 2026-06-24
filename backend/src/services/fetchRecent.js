require('dotenv').config();
const { fetchAndStoreGames } = require('./fetchGames');

// One-off "special flow": re-fetch the first N RAWG pages (ordered by -added)
// to pick up newly-added top games (e.g. GTA6, Wolverine) that the daily
// page-walking fetch has moved past. Existing games are skipped, and the
// lastFetchedPage counter is deliberately NOT touched.
const PAGES = Math.max(1, parseInt(process.env.PAGES || '5', 10));

async function refreshRecent() {
  let total = 0;

  for (let page = 1; page <= PAGES; page++) {
    total += await fetchAndStoreGames(page, 34);
  }

  console.log(`Special refresh complete. Re-checked pages 1-${PAGES}, inserted ${total} new game(s).`);
  process.exit(0);
}

refreshRecent().catch((err) => {
  console.error(err);
  process.exit(1);
});
