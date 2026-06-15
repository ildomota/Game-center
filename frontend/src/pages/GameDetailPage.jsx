import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGame, getGamePricing } from '../api/games'

function RatingBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
    </div>
  )
}

function PricingCard({ slug }) {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing', slug],
    queryFn: () => getGamePricing(slug),
    retry: false,
  })

  if (isLoading) return (
    <div className="animate-pulse bg-white/5 rounded-2xl h-32 border border-white/10" />
  )

  if (!data?.available) return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-gray-400 text-sm font-medium mb-1">Where to Buy</p>
      <p className="text-gray-600 text-sm">No Steam pricing available</p>
    </div>
  )

  if (data.free) return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-gray-400 text-sm font-medium mb-3">Where to Buy</p>
      <a href={data.steamUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between bg-[#1b2838] hover:bg-[#2a475e] rounded-xl p-4 transition group">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-sm">Steam</span>
        </div>
        <span className="text-green-400 font-bold">FREE</span>
      </a>
    </div>
  )

  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-gray-400 text-sm font-medium mb-3">Where to Buy</p>
      <a href={data.steamUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-between bg-[#1b2838] hover:bg-[#2a475e] rounded-xl p-4 transition group border border-white/5">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#66c0f4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.187.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z"/>
          </svg>
          <div>
            <p className="text-white font-medium text-sm">Steam</p>
            {data.onSale && (
              <p className="text-xs text-gray-400 line-through">{data.initialFormatted}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data.onSale && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{data.discountPercent}%
            </span>
          )}
          <span className={`font-bold text-lg ${data.onSale ? 'text-green-400' : 'text-white'}`}>
            {data.finalFormatted}
          </span>
        </div>
      </a>
    </div>
  )
}

function RequirementsBlock({ title, reqs }) {
  if (!reqs?.minimum && !reqs?.recommended) return null
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <h4 className="text-white font-semibold mb-4 capitalize">{title.replace(/-/g, ' ')}</h4>
      <div className="grid md:grid-cols-2 gap-6">
        {reqs.minimum && (
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">Minimum</p>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{reqs.minimum}</p>
          </div>
        )}
        {reqs.recommended && (
          <div>
            <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-2">Recommended</p>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{reqs.recommended}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GameDetailPage() {
  const { slug } = useParams()
  const [activeShot, setActiveShot] = useState(0)
  const [showFullDesc, setShowFullDesc] = useState(false)

  const { data: game, isLoading, isError } = useQuery({
    queryKey: ['game', slug],
    queryFn: () => getGame(slug),
  })

  if (isLoading) return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-8 animate-pulse space-y-6">
      <div className="h-[480px] bg-gray-800/60 rounded-2xl" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-gray-800/60 rounded w-2/3" />
          <div className="h-4 bg-gray-800/60 rounded w-full" />
          <div className="h-4 bg-gray-800/60 rounded w-5/6" />
        </div>
        <div className="h-48 bg-gray-800/60 rounded-2xl" />
      </div>
    </div>
  )

  if (isError || !game) return (
    <div className="text-center py-40">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-300 text-xl font-semibold mb-2">Game not found</p>
      <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm transition">← Back to Browse</Link>
    </div>
  )

  const screenshots = Array.isArray(game.screenshots) ? game.screenshots : []
  const platforms = Array.isArray(game.platforms) ? game.platforms : []
  const genres = Array.isArray(game.genres) ? game.genres : []
  const developers = Array.isArray(game.developers) ? game.developers : []
  const publishers = Array.isArray(game.publishers) ? game.publishers : []
  const stores = Array.isArray(game.stores) ? game.stores : []
  const tags = Array.isArray(game.tags) ? game.tags : []
  const sysReqs = game.systemRequirements || {}
  const totalRatings = game.ratingsCount || 0

  const metacriticColor = game.metacritic >= 75 ? 'text-green-400 border-green-500/50 bg-green-500/10'
    : game.metacritic >= 50 ? 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10'
    : 'text-red-400 border-red-500/50 bg-red-500/10'

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative w-full h-[480px] overflow-hidden">
        {game.backgroundImage ? (
          <img src={game.backgroundImage} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 w-full max-w-[1600px] mx-auto px-6 pb-8">
          <Link to="/browse" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition bg-black/30 backdrop-blur rounded-full px-3 py-1.5">
            ← Browse
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {genres.map((g) => (
              <span key={g.id || g.name} className="bg-indigo-600/80 backdrop-blur text-white text-xs font-medium rounded-full px-3 py-1">{g.name}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{game.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {game.rating > 0 && (
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur rounded-full px-3 py-1.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-white font-bold text-sm">{game.rating?.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">/ {game.ratingTop} · {totalRatings.toLocaleString()} ratings</span>
              </div>
            )}
            {game.metacritic && (
              <div className={`border rounded-full px-3 py-1.5 text-sm font-bold backdrop-blur ${metacriticColor}`}>
                Metacritic {game.metacritic}
              </div>
            )}
            {game.released && <span className="text-gray-400 text-sm bg-black/30 backdrop-blur rounded-full px-3 py-1.5">{game.released}</span>}
            {game.playtime > 0 && <span className="text-gray-400 text-sm bg-black/30 backdrop-blur rounded-full px-3 py-1.5">~{game.playtime}h playtime</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {game.description && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <p className={`text-gray-300 leading-relaxed text-sm ${!showFullDesc ? 'line-clamp-6' : ''}`}>
                    {game.description}
                  </p>
                  {game.description.length > 400 && (
                    <button onClick={() => setShowFullDesc(!showFullDesc)}
                      className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">
                      {showFullDesc ? 'Show less ↑' : 'Read more ↓'}
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Ratings breakdown */}
            {game.ratingsCount > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Player Ratings</h2>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-8 mb-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-white mb-1">{game.rating?.toFixed(1)}</p>
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-lg ${s <= Math.round(game.rating) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs">{totalRatings.toLocaleString()} ratings</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <RatingBar label="Exceptional" count={game.ratings?.find?.(r=>r.id===5)?.count||0} total={totalRatings} color="bg-green-500" />
                      <RatingBar label="Recommended" count={game.ratings?.find?.(r=>r.id===4)?.count||0} total={totalRatings} color="bg-blue-500" />
                      <RatingBar label="Meh" count={game.ratings?.find?.(r=>r.id===3)?.count||0} total={totalRatings} color="bg-yellow-500" />
                      <RatingBar label="Skip" count={game.ratings?.find?.(r=>r.id===1)?.count||0} total={totalRatings} color="bg-red-500" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
                <div className="rounded-2xl overflow-hidden border border-white/10 mb-3 bg-black">
                  <img src={screenshots[activeShot]} alt={`Screenshot ${activeShot + 1}`}
                    className="w-full object-contain max-h-[420px]" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {screenshots.map((src, i) => (
                    <button key={i} onClick={() => setActiveShot(i)}
                      className={`shrink-0 rounded-xl overflow-hidden border-2 transition ${i === activeShot ? 'border-indigo-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                      <img src={src} alt="" className="w-28 h-16 object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* System Requirements */}
            {Object.keys(sysReqs).length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">System Requirements</h2>
                <div className="space-y-4">
                  {Object.entries(sysReqs).map(([platform, reqs]) => (
                    <RequirementsBlock key={platform} title={platform} reqs={reqs} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right / Sidebar */}
          <div className="space-y-5">

            {/* Pricing */}
            <PricingCard slug={slug} />

            {/* Info */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-5">
              {platforms.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {platforms.map((p, i) => (
                      <span key={i} className="text-xs bg-white/10 text-gray-300 rounded-lg px-2.5 py-1">
                        {p.name || p.platform?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {developers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Developer</p>
                  <p className="text-white text-sm">{developers.map((d) => d.name).join(', ')}</p>
                </div>
              )}

              {publishers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Publisher</p>
                  <p className="text-white text-sm">{publishers.map((p) => p.name).join(', ')}</p>
                </div>
              )}

              {game.released && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Release Date</p>
                  <p className="text-white text-sm">{game.released}</p>
                </div>
              )}

              {game.esrbRating && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">ESRB Rating</p>
                  <span className="inline-block border border-white/20 text-gray-300 text-xs rounded px-2 py-1">{game.esrbRating}</span>
                </div>
              )}

              {game.playtime > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Avg Playtime</p>
                  <p className="text-white text-sm">{game.playtime} hours</p>
                </div>
              )}

              {game.website && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Website</p>
                  <a href={game.website} target="_blank" rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm break-all transition">
                    {game.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Available on */}
            {stores.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Available On</p>
                <div className="flex flex-wrap gap-2">
                  {stores.map((s, i) => (
                    <span key={i} className="text-xs bg-white/10 text-gray-300 rounded-lg px-3 py-1.5">{s.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, i) => (
                    <span key={i} className="text-xs bg-white/5 text-gray-500 rounded-lg px-2.5 py-1 border border-white/5">{t.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
