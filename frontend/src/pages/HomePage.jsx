import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'

function HeroSkeleton() {
  return <div className="animate-pulse bg-gray-800 rounded-2xl h-96 w-full" />
}

function FeaturedHero({ game }) {
  return (
    <Link to={`/game/${game.slug}`} className="group relative block rounded-2xl overflow-hidden h-96 border border-white/10 hover:border-indigo-500/40 transition">
      <img src={game.backgroundImage} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6">
        <div className="flex flex-wrap gap-1 mb-2">
          {Array.isArray(game.genres) && game.genres.slice(0, 3).map((g) => (
            <span key={g.id || g.name} className="text-xs bg-indigo-600/80 text-white rounded px-2 py-0.5">{g.name}</span>
          ))}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{game.name}</h2>
        <p className="text-gray-300 text-sm max-w-lg line-clamp-2">{game.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-300">
          {game.rating > 0 && <span className="flex items-center gap-1"><span className="text-yellow-400">★</span>{game.rating?.toFixed(1)}</span>}
          {game.metacritic && <span className="text-green-400 font-semibold">Metacritic {game.metacritic}</span>}
          {game.released && <span>{new Date(game.released).getFullYear()}</span>}
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['games', 'home'],
    queryFn: () => getGames({ limit: 21, ordering: '-rating' }),
  })

  const games = data?.results || []
  const featured = games[0]
  const rest = games.slice(1)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Top Rated Games</h1>
          <p className="text-gray-400 text-sm mt-1">Discover the highest rated games in our library</p>
        </div>
        <Link to="/browse" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
          Browse all →
        </Link>
      </div>

      {isLoading && <HeroSkeleton />}
      {isError && <p className="text-red-400 text-center py-20">Failed to load games. Make sure the backend is running.</p>}

      {featured && !isLoading && (
        <div className="mb-8">
          <FeaturedHero game={featured} />
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rest.map((game) => (
            <GameCard key={game.rawgId} game={game} />
          ))}
        </div>
      )}
    </main>
  )
}
