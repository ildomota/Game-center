import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'

function HeroGame({ game }) {
  if (!game) return null
  const genres = Array.isArray(game.genres) ? game.genres : []

  return (
    <Link to={`/game/${game.slug}`} className="group relative block w-full h-[500px] overflow-hidden rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all">
      <img src={game.backgroundImage} alt={game.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
        <div className="flex flex-wrap gap-2 mb-3">
          {genres.slice(0, 3).map((g) => (
            <span key={g.id || g.name} className="text-xs bg-indigo-600/80 backdrop-blur text-white rounded-full px-3 py-1 font-medium">{g.name}</span>
          ))}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-200 transition-colors">{game.name}</h2>
        {game.description && (
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">{game.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {game.rating > 0 && (
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur rounded-full px-3 py-1.5">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-white font-semibold text-sm">{game.rating?.toFixed(1)}</span>
              <span className="text-gray-400 text-xs">/ {game.ratingTop}</span>
            </div>
          )}
          {game.metacritic && (
            <div className={`rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur border ${
              game.metacritic >= 75 ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
              Metacritic {game.metacritic}
            </div>
          )}
          {game.released && <span className="text-gray-400 text-sm">{new Date(game.released).getFullYear()}</span>}
        </div>
      </div>
      <div className="absolute top-5 right-5">
        <span className="bg-indigo-600/90 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">Featured</span>
      </div>
    </Link>
  )
}

function Section({ title, subtitle, link, children }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">View all →</Link>
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
    <div className="w-full max-w-[1400px] mx-auto px-8 py-8 flex flex-col gap-12">
      {loadingTop
        ? <div className="animate-pulse bg-white/5 rounded-2xl h-[500px]" />
        : <HeroGame game={featured} />
      }

      <Section title="Top Rated" subtitle="Highest rated games in our library" link="/browse?ordering=-rating">
        {loadingTop ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-video" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rest.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>
        )}
      </Section>

      <Section title="Recently Released" subtitle="Latest games added to our library" link="/browse?ordering=-released">
        {loadingNew ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-video" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newGames.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>
        )}
      </Section>
    </div>
  )
}
