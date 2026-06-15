const axios = require('axios');
const prisma = require('./prisma');

// Resolve a game's Steam App ID from the stored field, its store URLs,
// or — as a fallback — Steam's store search by name. The result is
// persisted so the lookup only happens once per game.
async function resolveSteamAppId(slug) {
  const game = await prisma.game.findUnique({
    where: { slug },
    select: { id: true, name: true, steamAppId: true, stores: true },
  });
  if (!game) return { found: false, steamAppId: null };

  if (game.steamAppId) return { found: true, steamAppId: game.steamAppId };

  // Try extracting from a stored Steam store URL.
  let steamAppId = null;
  if (Array.isArray(game.stores)) {
    const steamStore = game.stores.find(
      (s) => s.slug === 'steam' || s.name?.toLowerCase() === 'steam'
    );
    const match = steamStore?.url?.match(/\/app\/(\d+)/);
    if (match) steamAppId = parseInt(match[1]);
  }

  // Fallback: search Steam's store by name.
  if (!steamAppId) {
    try {
      const { data } = await axios.get(
        'https://store.steampowered.com/api/storesearch/',
        { params: { term: game.name, l: 'english', cc: 'us' }, timeout: 5000 }
      );
      const hit = data?.items?.[0];
      if (hit?.id) steamAppId = hit.id;
    } catch {
      // ignore — game may simply not be on Steam
    }
  }

  // Persist whatever we found (or didn't) so we don't re-search every time.
  if (steamAppId) {
    await prisma.game.update({
      where: { id: game.id },
      data: { steamAppId },
    });
  }

  return { found: true, steamAppId };
}

module.exports = { resolveSteamAppId };
