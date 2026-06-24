import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Hls from 'hls.js'

function TrailerPlayer({ mp4, hls, poster }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Direct mp4 (older listings) — let the browser handle it.
    if (mp4) {
      video.src = mp4
      return
    }
    if (!hls) return

    // Native HLS (Safari).
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hls
      return
    }
    // hls.js for everyone else (Chrome, Firefox).
    if (Hls.isSupported()) {
      const player = new Hls()
      player.loadSource(hls)
      player.attachMedia(video)
      return () => player.destroy()
    }
  }, [mp4, hls])

  return (
    <video ref={videoRef} poster={poster} controls autoPlay muted loop playsInline
      className="w-full aspect-video bg-black" />
  )
}
import { getGame, getGamePricing, getPlayerCount, getGameNews, getGameTrailers } from '../api/games'

function PlayerCount({ slug }) {
  const { data } = useQuery({
    queryKey: ['players', slug],
    queryFn: () => getPlayerCount(slug),
    retry: false,
    refetchInterval: 60000,
  })
  if (!data?.available || !data.players) return null
  return (
    <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-white font-bold text-sm">{data.players.toLocaleString()}</span>
      <span className="text-white/40 text-sm">playing now</span>
    </div>
  )
}

function MediaGallery({ slug, screenshots }) {
  const [active, setActive] = useState(0)
  const { data: trailerData } = useQuery({
    queryKey: ['trailers', slug],
    queryFn: () => getGameTrailers(slug),
    retry: false,
  })

  const trailer = trailerData?.available ? trailerData.items[0] : null
  const media = [
    ...(trailer ? [{ type: 'video', mp4: trailer.mp4, hls: trailer.hls, poster: trailer.thumbnail }] : []),
    ...screenshots.map((src) => ({ type: 'image', src })),
  ]
  if (media.length === 0) return null

  const current = media[Math.min(active, media.length - 1)]

  return (
    <div>
      <div className="rounded-2xl overflow-hidden border border-white/8 bg-black mb-2">
        {current.type === 'video' ? (
          <TrailerPlayer key={current.mp4 || current.hls} mp4={current.mp4} hls={current.hls} poster={current.poster} />
        ) : (
          <img src={current.src} alt="" className="w-full object-cover aspect-video" />
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {media.slice(0, 12).map((m, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`relative rounded-xl overflow-hidden aspect-video transition-all border-2 ${
              i === active ? 'border-indigo-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-80'
            }`}>
            <img src={m.type === 'video' ? m.poster : m.src} alt="" className="w-full h-full object-cover" />
            {m.type === 'video' && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <i className="ti ti-player-play-filled text-white" style={{ fontSize: 18 }} aria-hidden="true" />
              </span>
            )}
          </button>
        ))}
      </div>
      {media.length > 12 && (
        <p className="text-center text-xs text-gray-600 mt-2">+{media.length - 12} more</p>
      )}
    </div>
  )
}

function NewsSection({ slug }) {
  const { data, isLoading } = useQuery({
    queryKey: ['news', slug],
    queryFn: () => getGameNews(slug),
    retry: false,
  })
  if (isLoading) return <div className="animate-pulse h-32 bg-white/5 rounded-2xl" />
  if (!data?.available) return null
  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-4">Latest News</h2>
      <div className="flex flex-col gap-3">
        {data.items.map((n) => (
          <a key={n.gid} href={n.url} target="_blank" rel="noopener noreferrer"
            className="block bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] transition">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <p className="text-white font-bold text-[15px] leading-snug">{n.title}</p>
              <i className="ti ti-external-link text-white/30 shrink-0" style={{ fontSize: 15 }} aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              {n.feedLabel && <span>{n.feedLabel}</span>}
              {n.date && <span>· {new Date(n.date * 1000).toLocaleDateString()}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function PricingSection({ slug }) {
  const { data, isLoading } = useQuery({
    queryKey: ['pricing', slug],
    queryFn: () => getGamePricing(slug),
    retry: false,
  })
  if (isLoading) return <div className="animate-pulse h-14 bg-white/5 rounded-xl" />
  if (!data?.available) return null
  return (
    <a href={data.steamUrl} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between bg-[#1b2838] hover:bg-[#1e3a50] border border-white/10 rounded-xl px-4 py-3 transition">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-[#66c0f4] shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.187.008l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z"/>
        </svg>
        <div>
          <p className="text-white text-sm font-semibold">Buy on Steam</p>
          {data.onSale && <p className="text-xs text-gray-500 line-through">{data.initialFormatted}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {data.onSale && (
          <span className="bg-green-500 text-white text-xs font-black px-2 py-1 rounded">-{data.discountPercent}%</span>
        )}
        <span className={`font-black text-xl ${data.onSale ? 'text-green-400' : 'text-white'} ${data.free ? 'text-green-400' : ''}`}>
          {data.free ? 'Free' : data.finalFormatted}
        </span>
      </div>
    </a>
  )
}

const REQ_ICONS = [
  { match: /^os|operating/i, icon: 'ti-brand-windows' },
  { match: /processor|cpu/i, icon: 'ti-cpu' },
  { match: /memory|ram/i, icon: 'ti-stack-2' },
  { match: /graphics|video|gpu/i, icon: 'ti-device-desktop' },
  { match: /directx/i, icon: 'ti-box' },
  { match: /storage|hard|disk|space/i, icon: 'ti-database' },
  { match: /sound|audio/i, icon: 'ti-volume' },
  { match: /network|internet/i, icon: 'ti-wifi' },
]

function reqIcon(label) {
  return REQ_ICONS.find((r) => r.match.test(label))?.icon || 'ti-point'
}

function parseRequirements(text) {
  if (!text) return []
  const cleaned = text.replace(/^\s*(minimum|recommended)\s*:?/i, '').trim()
  return cleaned
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':')
      if (idx === -1) return { label: '', value: line }
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
    })
    .filter((r) => r.value)
}

function RequirementColumn({ title, accent, text }) {
  const rows = parseRequirements(text)
  if (rows.length === 0) return null
  return (
    <div className="flex-1">
      <p className={`text-xs font-black uppercase tracking-widest mb-4 ${accent}`}>{title}</p>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
              <i className={`ti ${reqIcon(r.label)} text-white/50`} style={{ fontSize: 14 }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              {r.label && <p className="text-[11px] uppercase tracking-wide text-white/35 font-bold">{r.label}</p>}
              <p className="text-sm text-white/80 leading-snug">{r.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoPair({ icon, label, value, children }) {
  if (!value && !children) return null
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
        <i className={`ti ${icon} text-white/40`} style={{ fontSize: 17 }} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-white/35 uppercase tracking-widest font-bold mb-0.5">{label}</p>
        {children || <p className="text-white text-sm font-semibold leading-snug break-words">{value}</p>}
      </div>
    </div>
  )
}

export default function GameDetailPage() {
  const { slug } = useParams()
  const [showFullDesc, setShowFullDesc] = useState(false)

  const { data: game, isLoading, isError } = useQuery({
    queryKey: ['game', slug],
    queryFn: () => getGame(slug),
  })

  if (isLoading) return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-12 animate-pulse space-y-8">
      <div className="h-[460px] bg-white/5" />
      <div className="grid lg:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${100 - i * 10}%` }} />)}
        </div>
        <div className="h-96 bg-white/5 rounded-2xl" />
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
  const tags = Array.isArray(game.tags) ? game.tags.slice(0, 20) : []
  const sysReqs = game.systemRequirements || {}

  const ratingLabel = game.rating >= 4.5 ? 'Exceptional' : game.rating >= 3.5 ? 'Recommended' : game.rating >= 2.5 ? 'Mixed' : 'Skip'
  const ratingColor = game.rating >= 4.5 ? 'text-green-400' : game.rating >= 3.5 ? 'text-blue-400' : game.rating >= 2.5 ? 'text-yellow-400' : 'text-red-400'
  const mcBorder = game.metacritic >= 75 ? 'border-green-500 text-green-400' : game.metacritic >= 50 ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400'

  return (
    <div className="w-full">

      {/* ── HERO — full bleed background image ── */}
      <div className="relative w-full h-[460px] overflow-hidden">
        {game.backgroundImage
          ? <img src={game.backgroundImage} alt={game.name} className="w-full h-full object-cover object-top" />
          : <div className="w-full h-full bg-gray-900" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#081225] via-[#081225]/60 to-transparent" />
      </div>

      {/* ── PAGE CONTENT — pulled up over the hero bottom ── */}
      <div className="w-full max-w-[1400px] mx-auto px-8 -mt-40 relative z-10 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-300 transition">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-gray-300 transition">Games</Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs">{game.name}</span>
        </nav>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">

          {/* ════ LEFT — title, about, info ════ */}
          <div>
            {/* Date + platforms */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {game.released && (
                <span className="text-xs font-bold text-gray-400 bg-white/8 border border-white/10 px-3 py-1.5 rounded-lg">
                  {game.released}
                </span>
              )}
              {platforms.slice(0, 5).map((p, i) => (
                <span key={i} className="text-xs text-gray-500 font-medium">{p.name || p.platform?.name}</span>
              ))}
            </div>

            {/* TITLE — biggest element on the page */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight mb-5">
              {game.name}
            </h1>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {genres.map(g => (
                  <span key={g.id || g.name} className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            {game.rating > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/8">
                <span className={`text-sm font-black uppercase tracking-widest ${ratingColor}`}>{ratingLabel}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-white font-black text-xl">{game.rating?.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">/ {game.ratingTop}</span>
                </div>
                {game.ratingsCount > 0 && <span className="text-gray-500 text-sm">{game.ratingsCount.toLocaleString()} ratings</span>}
                {game.playtime > 0 && <span className="text-gray-500 text-sm">~{game.playtime}h playtime</span>}
                <PlayerCount slug={slug} />
              </div>
            )}

            {/* Media — trailer + screenshots */}
            <div className="mb-10">
              <MediaGallery slug={slug} screenshots={screenshots} />
            </div>

            {/* About */}
            {game.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-4">About</h2>
                <div className={`relative ${!showFullDesc ? 'max-h-48 overflow-hidden' : ''}`}>
                  <p className="text-gray-300 text-[15px] leading-8">{game.description}</p>
                  {!showFullDesc && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#081225] to-transparent" />
                  )}
                </div>
                {game.description.length > 300 && (
                  <button onClick={() => setShowFullDesc(!showFullDesc)}
                    className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition">
                    {showFullDesc ? 'Show less ↑' : 'Read more ↓'}
                  </button>
                )}
              </div>
            )}

            {/* Game info panel */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-7 mb-8">
              <h2 className="text-xl font-black text-white mb-6">Game Info</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <InfoPair icon="ti-device-gamepad-2" label="Platforms" value={platforms.map(p => p.name || p.platform?.name).join(', ')} />
                <InfoPair icon="ti-category" label="Genre" value={genres.map(g => g.name).join(', ')} />
                <InfoPair icon="ti-calendar-event" label="Release date" value={game.released} />
                <InfoPair icon="ti-code" label="Developer" value={developers.map(d => d.name).join(', ')} />
                <InfoPair icon="ti-building-store" label="Publisher" value={publishers.map(p => p.name).join(', ')} />
                {game.esrbRating && <InfoPair icon="ti-shield-check" label="Age rating" value={game.esrbRating} />}
                {game.playtime > 0 && <InfoPair icon="ti-clock" label="Avg playtime" value={`${game.playtime} hours`} />}
                {game.website && (
                  <InfoPair icon="ti-world" label="Website">
                    <a href={game.website} target="_blank" rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition block truncate">
                      {game.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </InfoPair>
                )}
              </div>

              {/* Stores */}
              {stores.length > 0 && (
                <div className="mt-8 pt-7 border-t border-white/[0.08]">
                  <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold mb-3.5">Available on</p>
                  <div className="flex flex-wrap gap-2">
                    {stores.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-white/[0.08] border border-white/10 text-gray-100 text-xs rounded-lg px-3 py-2 font-semibold hover:bg-white/[0.12] transition">
                        <i className="ti ti-shopping-bag text-white/40" style={{ fontSize: 13 }} aria-hidden="true" />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-8 pt-7 border-t border-white/[0.08]">
                  <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold mb-3.5">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t, i) => (
                      <span key={i} className="bg-white/[0.06] text-gray-300 text-xs rounded-full px-3 py-1.5 border border-white/[0.08] hover:border-white/25 hover:text-white transition cursor-default font-medium">{t.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* System requirements */}
            {Object.keys(sysReqs).length > 0 && (
              <div>
                <h2 className="text-2xl font-black text-white mb-4">System Requirements</h2>
                {Object.entries(sysReqs).map(([platform, reqs]) => {
                  if (!reqs?.minimum && !reqs?.recommended) return null
                  return (
                    <div key={platform} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-4">
                      <div className="flex items-center gap-2 mb-5">
                        <i className="ti ti-device-desktop-analytics text-white/40" style={{ fontSize: 16 }} aria-hidden="true" />
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{platform.replace(/-/g, ' ')}</p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-8">
                        <RequirementColumn title="Minimum" accent="text-indigo-400" text={reqs.minimum} />
                        {reqs.recommended && <div className="hidden md:block w-px bg-white/[0.06]" />}
                        <RequirementColumn title="Recommended" accent="text-green-400" text={reqs.recommended} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Latest news / patch notes */}
            <div className="mt-8">
              <NewsSection slug={slug} />
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR — meta ════ */}
          <div className="space-y-6">

            {/* Metacritic */}
            {game.metacritic && (
              <div className={`flex items-center justify-between border rounded-xl px-4 py-2.5 ${mcBorder}`}>
                <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Metacritic</span>
                <span className="text-2xl font-black leading-none">{game.metacritic}</span>
              </div>
            )}

            {/* Steam pricing */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Where to Buy</p>
              <PricingSection slug={slug} />
            </div>

            {/* Player ratings */}
            {game.ratingsCount > 0 && (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Player Ratings</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="shrink-0 text-center">
                    <p className="text-5xl font-black text-white leading-none">{game.rating?.toFixed(1)}</p>
                    <div className="flex gap-0.5 justify-center mt-2">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-base ${s <= Math.round(game.rating) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: 'Exceptional', color: 'bg-green-500', pct: 55 },
                      { label: 'Recommended', color: 'bg-blue-500', pct: 30 },
                      { label: 'Meh', color: 'bg-yellow-500', pct: 10 },
                      { label: 'Skip', color: 'bg-red-500', pct: 5 },
                    ].map(({ label, color, pct }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
                        <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
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
    </div>
  )
}
