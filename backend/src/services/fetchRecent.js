require('dotenv').config();
const { fetchAndStoreGames } = require('./fetchGames');

// One-off "special flow": re-fetch the first N RAWG pages to pick up newly
// released / newly announced games (e.g. GTA6, Wolverine) that the daily
// -added page-walk never surfaces. Existing games are skipped, and the
// lastFetchedPage counter is deliberately NOT touched.
//
// ORDERING controls which games land on the early pages:
//   -released  newest release dates first (incl. upcoming)  [default]
//   -created   newest entries added to RAWG's database
//   -added     most-wishlisted (same as the daily fetch)
const PAGES = Math.max(1, parseInt(process.env.PAGES || '5', 10));
const ORDERING = process.env.ORDERING || '-released';

async function refreshRecent() {
  let total = 0;

  for (let page = 1; page <= PAGES; page++) {
    total += await fetchAndStoreGames(page, 34, ORDERING);
  }

  console.log(`Special refresh complete. Re-checked pages 1-${PAGES} (ordering ${ORDERING}), inserted ${total} new game(s).`);
  process.exit(0);
}

refreshRecent().catch((err) => {
  console.error(err);
  process.exit(1);
});
