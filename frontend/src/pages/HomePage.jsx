import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'

function HeroGame({ game }) {
  if (!game) return null
  const genres = Array.isArray(game.genres) ? game.genres : []

  return (
    <Link to={`/game/${game.slug}`} className="group relative block w-full overflow-hidden" style={{ height: '460px' }}>
      <img
        src={game.backgroundImage}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#15151e] via-[#15151e]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#15151e]/70 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
        <div className="flex flex-wrap gap-2 mb-3">
          {genres.slice(0, 3).map((g) => (
            <span key={g.id || g.name} className="text-[11px] bg-white/10 text-white rounded px-2.5 py-0.5 font-semibold uppercase tracking-wide">
              {g.name}
            </span>
          ))}
        </div>
        <h2 className="text-4xl font-black text-white mb-3 leading-tight group-hover:text-indigo-200 transition-colors">
          {game.name}
        </h2>
        <div className="flex items-center gap-3">
          {game.rating > 0 && (
            <span className="flex items-center gap-1 bg-black/40 rounded px-3 py-1.5 text-sm font-bold text-white">
              <span className="text-yellow-400">★</span> {game.rating?.toFixed(1)}
            </span>
          )}
          {game.metacritic && (
            <span className={`rounded px-3 py-1.5 text-xs font-bold border ${
              game.metacritic >= 75 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              Metacritic {game.metacritic}
            </span>
          )}
          {game.released && <span className="text-[#777] text-sm">{new Date(game.released).getFullYear()}</span>}
          <span className="text-sm text-indigo-400 font-semibold group-hover:text-white transition-colors">View game →</span>
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({ title, subtitle, link }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-[#555] text-sm mt-1">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} className="text-xs font-semibold text-[#666] hover:text-white transition-colors uppercase tracking-widest">
          View all →
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const { data: topData, isLoading: loadingTop } = useQuery({
    queryKey: ['games', 'top'],
    queryFn: () => getGames({ limit: 9, ordering: '-rating' }),
  })
  const { data: newData, isLoading: loadingNew } = useQuery({
    queryKey: ['games', 'new'],
    queryFn: () => getGames({ limit: 10, ordering: '-released' }),
  })

  const topGames = topData?.results || []
  const newGames = newData?.results || []
  const featured = topGames[0]
  const rest = topGames.slice(1)

  return (
    <div className="w-full flex flex-col">
      {/* Hero — full bleed across content area */}
      {loadingTop
        ? <div className="animate-pulse bg-white/5" style={{ height: 460 }} />
        : <HeroGame game={featured} />
      }

      {/* Sections — full width with padding */}
      <div className="w-full px-8 flex flex-col gap-14 py-10">
        <section>
          <SectionHeader title="Top Rated" subtitle="Highest rated games in our library" link="/browse?ordering=-rating" />
          {loadingTop ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="animate-pulse bg-white/5 rounded-xl w-full" style={{ aspectRatio: '16/9' }} />
                  <div className="animate-pulse bg-white/5 rounded h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
              {rest.map((game) => <GameCard key={game.rawgId} game={game} />)}
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Recently Released" subtitle="Latest games added to our library" link="/browse?ordering=-released" />
          {loadingNew ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="animate-pulse bg-white/5 rounded-xl w-full" style={{ aspectRatio: '16/9' }} />
                  <div className="animate-pulse bg-white/5 rounded h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
              {newGames.map((game) => <GameCard key={game.rawgId} game={game} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
