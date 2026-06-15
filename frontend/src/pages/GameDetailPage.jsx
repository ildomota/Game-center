import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGame } from '../api/games'

function RequirementBlock({ title, reqs }) {
  if (!reqs) return null
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <div className="grid sm:grid-cols-2 gap-4">
        {reqs.minimum && (
          <div>
            <p className="text-xs text-indigo-400 font-semibold mb-1 uppercase tracking-wide">Minimum</p>
            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{reqs.minimum}</p>
          </div>
        )}
        {reqs.recommended && (
          <div>
            <p className="text-xs text-green-400 font-semibold mb-1 uppercase tracking-wide">Recommended</p>
            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">{reqs.recommended}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GameDetailPage() {
  const { slug } = useParams()
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  const { data: game, isLoading, isError } = useQuery({
    queryKey: ['game', slug],
    queryFn: () => getGame(slug),
  })

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-72 bg-gray-800 rounded-2xl mb-6" />
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-800 rounded w-full mb-2" />
        <div className="h-4 bg-gray-800 rounded w-5/6" />
      </div>
    )
  }

  if (isError || !game) {
    return (
      <div className="text-center py-32">
        <p className="text-red-400 text-lg mb-4">Game not found.</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">← Back to home</Link>
      </div>
    )
  }

  const screenshots = Array.isArray(game.screenshots) ? game.screenshots : []
  const platforms = Array.isArray(game.platforms) ? game.platforms : []
  const genres = Array.isArray(game.genres) ? game.genres : []
  const developers = Array.isArray(game.developers) ? game.developers : []
  const publishers = Array.isArray(game.publishers) ? game.publishers : []
  const stores = Array.isArray(game.stores) ? game.stores : []
  const tags = Array.isArray(game.tags) ? game.tags : []
  const sysReqs = game.systemRequirements || {}

  const ratingColor =
    game.metacritic >= 75 ? 'text-green-400 border-green-400'
    : game.metacritic >= 50 ? 'text-yellow-400 border-yellow-400'
    : 'text-red-400 border-red-400'

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition">
        ← Back to Browse
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 mb-8 border border-white/10">
        {game.backgroundImage ? (
          <img src={game.backgroundImage} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-6xl">🎮</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{game.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
            {game.rating > 0 && (
              <span className="flex items-center gap-1"><span className="text-yellow-400">★</span>{game.rating?.toFixed(1)} / {game.ratingTop}</span>
            )}
            {game.metacritic && (
              <span className={`border rounded px-2 py-0.5 font-bold ${ratingColor}`}>{game.metacritic} Metacritic</span>
            )}
            {game.released && <span>{game.released}</span>}
            {game.playtime > 0 && <span>{game.playtime}h avg playtime</span>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {game.description && (
            <section>
              <h2 className="text-xl font-bold text-white mb-3">About</h2>
              <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line line-clamp-[12]">{game.description}</p>
            </section>
          )}

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Screenshots</h2>
              <div className="rounded-xl overflow-hidden mb-3 border border-white/10">
                <img
                  src={screenshots[activeScreenshot]}
                  alt={`Screenshot ${activeScreenshot + 1}`}
                  className="w-full object-cover max-h-80"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {screenshots.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveScreenshot(i)}
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition ${i === activeScreenshot ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="w-24 h-16 object-cover" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* System Requirements */}
          {Object.keys(sysReqs).length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-3">System Requirements</h2>
              <div className="space-y-4">
                {Object.entries(sysReqs).map(([platform, reqs]) => (
                  <RequirementBlock key={platform} title={platform.replace(/-/g, ' ').toUpperCase()} reqs={reqs} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Info card */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10 space-y-4 text-sm">
            {platforms.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Platforms</p>
                <p className="text-white">{platforms.map((p) => p.name || p.platform?.name).join(', ')}</p>
              </div>
            )}
            {genres.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Genres</p>
                <p className="text-white">{genres.map((g) => g.name).join(', ')}</p>
              </div>
            )}
            {developers.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Developer</p>
                <p className="text-white">{developers.map((d) => d.name).join(', ')}</p>
              </div>
            )}
            {publishers.length > 0 && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Publisher</p>
                <p className="text-white">{publishers.map((p) => p.name).join(', ')}</p>
              </div>
            )}
            {game.esrbRating && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">ESRB Rating</p>
                <p className="text-white">{game.esrbRating}</p>
              </div>
            )}
            {game.website && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Website</p>
                <a href={game.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 break-all">
                  {game.website}
                </a>
              </div>
            )}
          </div>

          {/* Stores */}
          {stores.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Available On</p>
              <div className="flex flex-wrap gap-2">
                {stores.map((s) => (
                  <span key={s.slug || s.name} className="bg-white/10 text-gray-200 text-xs rounded-lg px-3 py-1.5">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t.id || t.name} className="bg-white/5 text-gray-400 text-xs rounded px-2 py-1">
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
