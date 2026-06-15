import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'

function HeroGame({ game }) {
  if (!game) return null
  const genres = Array.isArray(game.genres) ? game.genres : []

  return (
    <Link to={`/game/${game.slug}`} className="group relative block w-full h-[520px] overflow-hidden rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
      <img
        src={game.backgroundImage}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
        <div className="flex flex-wrap gap-2 mb-3">
          {genres.slice(0, 3).map((g) => (
            <span key={g.id || g.name} className="text-xs bg-indigo-600/80 backdrop-blur text-white rounded-full px-3 py-1 font-medium">
              {g.name}
            </span>
          ))}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors leading-tight">
          {game.name}
        </h2>
        {game.description && (
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">{game.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {game.rating > 0 && (
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5">
              <span className="text-yellow-400">★</span>
              <span className="text-white font-semibold">{game.rating?.toFixed(1)}</span>
              <span className="text-gray-400">/ {game.ratingTop}</span>
            </div>
          )}
          {game.metacritic && (
            <div className={`rounded-full px-3 py-1.5 font-bold text-sm backdrop-blur ${
              game.metacritic >= 75 ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : game.metacritic >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              Metacritic {game.metacritic}
            </div>
          )}
          {game.released && (
            <span className="text-gray-400">{new Date(game.released).getFullYear()}</span>
          )}
        </div>
      </div>

      <div className="absolute top-6 right-6">
        <span className="bg-indigo-600/90 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          Featured
        </span>
      </div>
    </Link>
  )
}

function Section({ title, subtitle, link, children }) {
  return (
    <section className="w-full">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition flex items-center gap-1">
            View all <span>→</span>
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

export default function HomePage() {
  const { data: topData, isLoading: loadingTop } = useQuery({
    queryKey: ['games', 'top'],
    queryFn: () => getGames({ limit: 9, ordering: '-rating' }),
  })

  const { data: newData, isLoading: loadingNew } = useQuery({
    queryKey: ['games', 'new'],
    queryFn: () => getGames({ limit: 8, ordering: '-released' }),
  })

  const topGames = topData?.results || []
  const newGames = newData?.results || []
  const featured = topGames[0]
  const rest = topGames.slice(1)

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-14">

      {/* Hero */}
      {loadingTop ? (
        <div className="animate-pulse bg-gray-800 rounded-2xl h-[520px]" />
      ) : (
        <HeroGame game={featured} />
      )}

      {/* Top rated */}
      <Section title="Top Rated" subtitle="Highest rated games in our library" link="/browse?ordering=-rating">
        {loadingTop ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-gray-800 rounded-xl aspect-video" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {rest.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>
        )}
      </Section>

      {/* Newest */}
      <Section title="Recently Released" subtitle="The latest games added to our library" link="/browse?ordering=-released">
        {loadingNew ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-gray-800 rounded-xl aspect-video" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {newGames.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>
        )}
      </Section>
    </div>
  )
}
