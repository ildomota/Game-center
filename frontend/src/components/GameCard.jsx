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

function getPlatformIcon(slug) {
  if (!slug) return null
  const key = Object.keys(PLATFORM_ICONS).find((k) => slug.includes(k))
  return key ? PLATFORM_ICONS[key] : null
}

export default function GameCard({ game }) {
  const addedCount = game.ratingsCount || 0

  const platforms = Array.isArray(game.platforms)
    ? game.platforms
        .map((p) => {
          const slug = p?.platform?.slug || ''
          const icon = getPlatformIcon(slug)
          return icon ? { slug, icon } : null
        })
        .filter(Boolean)
        .filter((p, i, arr) => arr.findIndex((x) => x.icon === p.icon) === i)
        .slice(0, 4)
    : []

  const scoreColor = !game.metacritic
    ? ''
    : game.metacritic >= 75
    ? 'text-[#5bdd6e] border-[#5bdd6e]'
    : game.metacritic >= 50
    ? 'text-[#f5c518] border-[#f5c518]'
    : 'text-red-500 border-red-500'

  return (
    <Link to={`/game/${game.slug}`} className="group flex flex-col bg-[#202028] rounded-xl overflow-hidden hover:bg-[#26262f] hover:-translate-y-1 transition-all duration-200 shadow-lg shadow-black/20">

      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-[#1a1a22]">
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
      <div className="p-4 flex flex-col gap-3">

        {/* Row 1: platforms + metacritic */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {platforms.map((p) => (
              <i key={p.slug} className={`ti ${p.icon} text-white/40`} style={{ fontSize: 14 }} aria-hidden="true" />
            ))}
          </div>
          {game.metacritic && (
            <div className={`px-2 py-1 rounded-md border text-sm font-extrabold ${scoreColor}`}>
              {game.metacritic}
            </div>
          )}
        </div>

        {/* Row 2: title */}
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
          {game.name}
        </h3>

        {/* Row 3: add button with count */}
        <button
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 self-start bg-white/[0.07] hover:bg-white/[0.14] text-white/70 hover:text-white rounded-lg px-3 py-1.5 transition-all"
        >
          <i className="ti ti-plus" style={{ fontSize: 13 }} aria-hidden="true" />
          <span className="text-sm font-bold">{addedCount > 0 ? addedCount.toLocaleString() : 'Add'}</span>
        </button>

      </div>
    </Link>
  )
}
