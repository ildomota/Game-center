import { Link } from 'react-router-dom'
import ScoreBadge from './ScoreBadge'

const PLATFORM_ICONS = {
  pc: 'ti-device-laptop',
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

  return (
    <Link
      to={`/game/${game.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-[#131b2e] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-video overflow-hidden bg-[#0f1423]">
        {game.backgroundImage ? (
          <img
            src={game.backgroundImage}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <i className="ti ti-device-gamepad-2 text-5xl" aria-hidden="true" />
          </div>
        )}

        <div className="absolute bottom-6 left-4 w-5 h-5 rounded-full border border-white/80 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <i className="ti ti-player-play-filled text-white" style={{ fontSize: 9 }} aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col p-4 bg-gradient-to-b from-[#131b2e] to-[#101729]">
        <div className="flex items-center justify-between gap-2 mb-2 min-h-4">
          <div className="flex items-center gap-2">
            {platforms.map((p) => (
              <i key={p.key} className={`ti ${p.icon} text-white/75`} style={{ fontSize: 16 }} aria-hidden="true" />
            ))}
          </div>
          <ScoreBadge score={game.metacritic} />
        </div>

        <h3 className="text-white font-semibold text-[15px] leading-6 line-clamp-2">
          {game.name}
        </h3>

        <button
          onClick={(e) => e.preventDefault()}
          className="mt-4 self-start flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-[#2d3449] hover:bg-[#3a4259] text-white transition-colors"
        >
          <i className="ti ti-plus" style={{ fontSize: 11 }} aria-hidden="true" />
          <span className="text-[11px] font-semibold leading-none">
            {addedCount > 0 ? addedCount.toLocaleString() : 'Add'}
          </span>
        </button>
      </div>
    </Link>
  )
}
