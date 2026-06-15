import { Link } from 'react-router-dom'

function MetacriticBadge({ score }) {
  if (!score) return null
  const color = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className={`absolute top-2 right-2 ${color} text-white text-xs font-bold rounded px-1.5 py-0.5 shadow`}>
      {score}
    </div>
  )
}

export default function GameCard({ game }) {
  const genres = Array.isArray(game.genres) ? game.genres.slice(0, 2) : []

  return (
    <Link
      to={`/game/${game.slug}`}
      className="group flex flex-col bg-[#13131f] rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        {game.backgroundImage ? (
          <img
            src={game.backgroundImage}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        )}
        <MetacriticBadge score={game.metacritic} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13131f] via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {game.name}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {genres.map((g) => (
              <span key={g.id || g.name} className="text-xs bg-white/5 text-gray-400 rounded-md px-2 py-0.5">
                {g.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0 ml-2">
            {game.rating > 0 && (
              <span className="flex items-center gap-0.5">
                <span className="text-yellow-400">★</span>
                {game.rating?.toFixed(1)}
              </span>
            )}
            {game.released && <span className="text-gray-600">·</span>}
            {game.released && <span>{new Date(game.released).getFullYear()}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
