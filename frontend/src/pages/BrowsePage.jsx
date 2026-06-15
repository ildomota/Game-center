import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 'Puzzle', 'Racing', 'Sports', 'Simulation', 'Horror']
const ORDERINGS = [
  { label: 'Highest Rated', value: '-rating' },
  { label: 'Newest', value: '-released' },
  { label: 'Most Popular', value: '-ratingsCount' },
  { label: 'Best Metacritic', value: '-metacritic' },
]

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre') || ''
  const ordering = searchParams.get('ordering') || '-rating'

  useEffect(() => { setPage(1) }, [search, genre, ordering])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['games', 'browse', search, genre, ordering, page],
    queryFn: () => getGames({ search, genre, ordering, page, limit: 20 }),
    keepPreviousData: true,
  })

  const games = data?.results || []

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          {search ? `Results for "${search}"` : 'Browse Games'}
        </h1>
        <select
          value={ordering}
          onChange={(e) => setParam('ordering', e.target.value)}
          className="bg-white/10 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {ORDERINGS.map((o) => (
            <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Genre filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setParam('genre', '')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${!genre ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        >
          All
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setParam('genre', genre === g ? '' : g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${genre === g ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            {g}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-xl aspect-video" />
          ))}
        </div>
      )}

      {isError && <p className="text-red-400 text-center py-20">Failed to load games.</p>}

      {!isLoading && games.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No games found.</p>
          {search && <p className="text-gray-500 text-sm mt-2">Try a different search term.</p>}
        </div>
      )}

      {games.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <GameCard key={game.rawgId} game={game} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm disabled:opacity-30 hover:bg-white/20 transition"
            >
              ← Previous
            </button>
            <span className="text-gray-400 text-sm">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.next}
              className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm disabled:opacity-30 hover:bg-white/20 transition"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </main>
  )
}
