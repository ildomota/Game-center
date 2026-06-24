import { Link } from 'react-router-dom'

const PLATFORM_ICONS = {
  pc: 'ti-brand-windows',
  playstation: 'ti-device-gamepad-2',
  xbox: 'ti-device-gamepad',
  nintendo: 'ti-device-nintendo',
  ios: 'ti-brand-apple',
  android: 'ti-brand-android',
  mac: 'ti-brand-apple',
  linux: 'ti-brand-ubuntu',
}

function getPlatformIcon(text) {
  if (!text) return null
  const t = text.toLowerCase()
  const key = Object.keys(PLATFORM_ICONS).find((k) => t.includes(k))
  return key ? PLATFORM_ICONS[key] : null
}

export default function GameCard({ game }) {
  const addedCount = game.ratingsCount || 0

  const platforms = Array.isArray(game.platforms)
    ? game.platforms
        .map((p) => {
          const text = p?.platform?.slug || p?.platform?.name || p?.slug || p?.name || ''
          const icon = getPlatformIcon(text)
          return icon ? { key: text, icon } : null
        })
        .filter(Boolean)
        .filter((p, i, arr) => arr.findIndex((x) => x.icon === p.icon) === i)
        .slice(0, 4)
    : []

  const scoreColor = !game.metacritic
    ? ''
    : game.metacritic >= 75
    ? 'text-[#5bdd6e] border-[#5bdd6e]/60'
    : game.metacritic >= 50
    ? 'text-[#f5c518] border-[#f5c518]/60'
    : 'text-red-500 border-red-500/60'

  return (
    <Link to={`/game/${game.slug}`} className="group flex flex-col bg-[#121b2e] rounded-2xl p-3 hover:bg-[#16203a] hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-black/20">

      {/* Image — inset & rounded on all sides */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0b1322]">
        {game.backgroundImage ? (
          <img
            src={game.backgroundImage}
            alt={game.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <i className="ti ti-device-gamepad-2 text-5xl" aria-hidden="true" />
          </div>
        )}

        {/* Play overlay — bottom-left */}
        <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <i className="ti ti-player-play-filled text-white" style={{ fontSize: 16 }} aria-hidden="true" />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col" style={{ paddingLeft: 6, paddingRight: 6, paddingTop: 20, paddingBottom: 6 }}>

        {/* Row 1: platforms + metacritic */}
        <div className="flex items-center justify-between" style={{ marginBottom: 28, minHeight: 20 }}>
          <div className="flex items-center" style={{ gap: 14 }}>
            {platforms.map((p) => (
              <i key={p.key} className={`ti ${p.icon} text-white/60`} style={{ fontSize: 18 }} aria-hidden="true" />
            ))}
          </div>
          {game.metacritic && (
            <span className={`shrink-0 px-2 py-0.5 rounded-md border text-sm font-extrabold ${scoreColor}`}>
              {game.metacritic}
            </span>
          )}
        </div>

        {/* Row 2: title */}
        <h3 className="text-white font-extrabold text-xl leading-tight line-clamp-2">
          {game.name}
        </h3>

        {/* Row 3: add button with count */}
        <button
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-1.5 self-start bg-[#29344d] hover:bg-[#33405e] text-white rounded-md px-3 h-8 transition-all"
          style={{ marginTop: 36 }}
        >
          <i className="ti ti-plus" style={{ fontSize: 13 }} aria-hidden="true" />
          <span className="text-sm font-extrabold">{addedCount > 0 ? addedCount.toLocaleString() : 'Add'}</span>
        </button>

      </div>
    </Link>
  )
}
