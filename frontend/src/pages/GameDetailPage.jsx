import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGame, getGamePricing } from '../api/games'

function PricingSection({ slug }) {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing', slug],
    queryFn: () => getGamePricing(slug),
    retry: false,
  })

  if (isLoading) return (
    <div className="animate-pulse h-16 bg-white/5 rounded-xl" />
  )
  if (!data?.available) return null

  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Where to Buy</p>
      <a
        href={data.steamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-[#1b2838] hover:bg-[#1e3a50] border border-white/10 rounded-xl px-4 py-3 transition group"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#66c0f4] shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.187.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z"/>
          </svg>
          <div>
            <p className="text-white text-sm font-medium">Steam</p>
            {data.onSale && <p className="text-xs text-gray-500 line-through">{data.initialFormatted}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data.onSale && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{data.discountPercent}%
            </span>
          )}
          <span className={`font-bold ${data.onSale ? 'text-green-400' : 'text-white'} ${data.free ? 'text-green-400' : ''}`}>
            {data.free ? 'Free' : data.finalFormatted}
          </span>
        </div>
      </a>
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="py-3 border-b border-white/5 last:border-0">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">{label}</p>
      <p className="text-gray-200 text-sm">{value}</p>
    </div>
  )
}

function MetacriticBadge({ score }) {
  if (!score) return null
  const color = score >= 75 ? 'border-green-500 text-green-400'
    : score >= 50 ? 'border-yellow-500 text-yellow-400'
    : 'border-red-500 text-red-400'
  return (
    <div className={`border-2 rounded-lg px-3 py-2 text-center ${color}`}>
      <p className="text-2xl font-bold leading-none">{score}</p>
      <p className="text-xs text-gray-500 mt-0.5">Metacritic</p>
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
    <div className="w-full max-w-[1400px] mx-auto px-8 py-12 animate-pulse space-y-8">
      <div className="h-[400px] bg-white/5 rounded-2xl" />
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded" />)}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    </div>
  )

  if (isError || !game) return (
    <div className="text-center py-40">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-gray-300 text-xl font-semibold mb-4">Game not found</p>
      <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm">← Back to Browse</Link>
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

  const ratingLabel = game.rating >= 4.5 ? 'Exceptional' : game.rating >= 3.5 ? 'Recommended' : game.rating >= 2.5 ? 'Mixed' : 'Skip'
  const ratingColor = game.rating >= 4.5 ? 'text-green-400' : game.rating >= 3.5 ? 'text-blue-400' : game.rating >= 2.5 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="w-full">
      {/* Hero — full bleed */}
      <div className="relative w-full h-[420px] overflow-hidden">
        {game.backgroundImage
          ? <img src={game.backgroundImage} alt={game.name} className="w-full h-full object-cover object-top" />
          : <div className="w-full h-full bg-gray-900" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-[#0a0a0f]/10" />
      </div>

      {/* Main content — pulled up over the hero */}
      <div className="w-full max-w-[1400px] mx-auto px-8 -mt-32 relative z-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-gray-300 transition">Games</Link>
          <span>/</span>
          <span className="text-gray-400">{game.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-8">

            {/* Title block */}
            <div>
              {game.released && (
                <p className="text-gray-400 text-sm mb-2 flex items-center gap-3">
                  <span>{game.released}</span>
                  {platforms.slice(0, 3).map((p, i) => (
                    <span key={i} className="text-gray-600">·</span>
                  ))}
                  {platforms.slice(0, 3).map((p, i) => (
                    <span key={i} className="text-gray-400 text-xs">{p.name || p.platform?.name}</span>
                  ))}
                </p>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{game.name}</h1>

              {/* Rating row */}
              {game.rating > 0 && (
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <div className={`text-sm font-semibold ${ratingColor}`}>
                    {ratingLabel}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">{game.rating?.toFixed(1)}</span>
                    <span>/ {game.ratingTop}</span>
                  </div>
                  {game.ratingsCount > 0 && (
                    <span className="text-gray-500 text-sm">{game.ratingsCount.toLocaleString()} ratings</span>
                  )}
                  {game.playtime > 0 && (
                    <span className="text-gray-500 text-sm">~{game.playtime}h playtime</span>
                  )}
                </div>
              )}
            </div>

            {/* About */}
            {game.description && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">About</h2>
                <div className="text-gray-300 text-sm leading-7">
                  <p className={!showFullDesc ? 'line-clamp-5' : ''}>
                    {game.description}
                  </p>
                  {game.description.length > 400 && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                    >
                      {showFullDesc ? 'Show less ↑' : 'Read more ↓'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Info grid — RAWG style */}
            <div className="grid grid-cols-2 gap-x-8 border-t border-white/5">
              <InfoRow label="Platforms" value={platforms.map(p => p.name || p.platform?.name).join(', ')} />
              <InfoRow label="Genre" value={genres.map(g => g.name).join(', ')} />
              <InfoRow label="Release date" value={game.released} />
              <InfoRow label="Developer" value={developers.map(d => d.name).join(', ')} />
              <InfoRow label="Publisher" value={publishers.map(p => p.name).join(', ')} />
              {game.esrbRating && <InfoRow label="Age rating" value={game.esrbRating} />}
              {game.playtime > 0 && <InfoRow label="Avg playtime" value={`${game.playtime} hours`} />}
              {game.website && (
                <div className="py-3 border-b border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">Website</p>
                  <a href={game.website} target="_blank" rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm transition truncate block">
                    {game.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Available on */}
            {stores.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Available on</p>
                <div className="flex flex-wrap gap-2">
                  {stores.map((s, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg px-3 py-1.5 font-medium">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, i) => (
                    <span key={i} className="bg-white/5 text-gray-400 text-xs rounded-lg px-2.5 py-1 border border-white/5 hover:border-white/20 transition cursor-default">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Screenshots</h2>
                <div className="rounded-xl overflow-hidden bg-black mb-3 border border-white/10">
                  <img
                    src={screenshots[activeShot]}
                    alt=""
                    className="w-full object-cover max-h-[380px]"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {screenshots.slice(0, 10).map((src, i) => (
                    <button key={i} onClick={() => setActiveShot(i)}
                      className={`rounded-lg overflow-hidden border-2 transition aspect-video ${i === activeShot ? 'border-indigo-500' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* System requirements */}
            {Object.keys(sysReqs).length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">System Requirements</h2>
                {Object.entries(sysReqs).map(([platform, reqs]) => {
                  if (!reqs?.minimum && !reqs?.recommended) return null
                  return (
                    <div key={platform} className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
                      <h4 className="text-white font-semibold capitalize mb-4 text-sm">{platform.replace(/-/g, ' ')}</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {reqs.minimum && (
                          <div>
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-2">Minimum</p>
                            <p className="text-gray-400 text-xs leading-6 whitespace-pre-line">{reqs.minimum}</p>
                          </div>
                        )}
                        {reqs.recommended && (
                          <div>
                            <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-2">Recommended</p>
                            <p className="text-gray-400 text-xs leading-6 whitespace-pre-line">{reqs.recommended}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">

            {/* Metacritic */}
            {game.metacritic && (
              <div className="flex items-center gap-4">
                <MetacriticBadge score={game.metacritic} />
                <div>
                  <p className="text-white text-sm font-semibold">Metacritic Score</p>
                  <p className="text-gray-500 text-xs mt-0.5">Based on critic reviews</p>
                </div>
              </div>
            )}

            {/* Steam pricing */}
            <PricingSection slug={slug} />

            {/* Screenshots grid preview */}
            {screenshots.length > 1 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Media</p>
                <div className="grid grid-cols-2 gap-2">
                  {screenshots.slice(0, 4).map((src, i) => (
                    <button key={i} onClick={() => {
                      setActiveShot(i)
                      document.querySelector('#screenshots')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                      className="rounded-lg overflow-hidden aspect-video bg-gray-900 hover:opacity-80 transition">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                {screenshots.length > 4 && (
                  <p className="text-center text-gray-600 text-xs mt-2">+{screenshots.length - 4} more</p>
                )}
              </div>
            )}

            {/* Rating breakdown */}
            {game.ratingsCount > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Player Ratings</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{game.rating?.toFixed(1)}</p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-sm ${s <= Math.round(game.rating) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[
                      { label: 'Exceptional', color: 'bg-green-500', pct: 55 },
                      { label: 'Recommended', color: 'bg-blue-500', pct: 30 },
                      { label: 'Meh', color: 'bg-yellow-500', pct: 10 },
                      { label: 'Skip', color: 'bg-red-500', pct: 5 },
                    ].map(({ label, color, pct }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-xs text-center">{game.ratingsCount.toLocaleString()} total ratings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pb-16" />
    </div>
  )
}
