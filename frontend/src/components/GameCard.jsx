import { Link } from 'react-router-dom'

const PLATFORM_ICONS = {
  pc: '🖥️',
  playstation: '🎮',
  xbox: '🎮',
  nintendo: '🕹️',
  ios: '📱',
  android: '📱',
}

function getPlatformIcon(slug) {
  for (const [key, icon] of Object.entries(PLATFORM_ICONS)) {
    if (slug?.includes(key)) return icon
  }
  return null
}

export default function GameCard({ game }) {
  const platforms = Array.isArray(game.platforms)
    ? [...new Map(
        game.platforms
          .map((p) => {
            const slug = p.slug || p.platform?.slug || ''
            const family = slug.includes('playstation') ? 'playstation'
              : slug.includes('xbox') ? 'xbox'
              : slug.includes('nintendo') ? 'nintendo'
              : slug.includes('ios') ? 'ios'
              : slug.includes('android') ? 'android'
              : slug.includes('pc') ? 'pc'
              : slug
            return [family, getPlatformIcon(family)]
          })
          .filter(([, icon]) => icon)
      ).values()]
    : []

  const ratingColor =
    game.metacritic >= 75 ? 'text-green-400 border-green-400'
    : game.metacritic >= 50 ? 'text-yellow-400 border-yellow-400'
    : 'text-red-400 border-red-400'

  return (
    <Link to={`/game/${game.slug}`} className="group block bg-[#1a1a2e] rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-gray-800">
        {game.backgroundImage ? (
          <img
            src={game.backgroundImage}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        )}
        {game.metacritic && (
          <div className={`absolute top-2 right-2 text-xs font-bold border rounded px-1.5 py-0.5 bg-black/70 ${ratingColor}`}>
            {game.metacritic}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {game.name}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex gap-1">
            {platforms.slice(0, 4).map(([, icon], i) => (
              <span key={i}>{icon}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {game.rating > 0 && (
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                {game.rating?.toFixed(1)}
              </span>
            )}
            {game.released && (
              <span>{new Date(game.released).getFullYear()}</span>
            )}
          </div>
        </div>

        {Array.isArray(game.genres) && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {game.genres.slice(0, 3).map((g) => (
              <span key={g.id || g.name} className="text-xs bg-white/5 text-gray-400 rounded px-2 py-0.5">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
