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
    queryFn: () => getGames({ search, genre, ordering, page, limit: 24 }),
    keepPreviousData: true,
  })

  const games = data?.results || []
  const total = data?.count || 0

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          {search ? `Results for "${search}"` : 'Browse Games'}
        </h1>
        <p className="text-gray-500 text-sm">
          {total > 0 ? `${total.toLocaleString()} games found` : 'Explore our full library'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-2 flex-1">
          <button
            onClick={() => setParam('genre', '')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!genre ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
          >All</button>
          {GENRES.map((g) => (
            <button key={g} onClick={() => setParam('genre', genre === g ? '' : g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${genre === g ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {g}
            </button>
          ))}
        </div>
        <select value={ordering} onChange={(e) => setParam('ordering', e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shrink-0 cursor-pointer">
          {ORDERINGS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#13131f]">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(24)].map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-video" />)}
        </div>
      )}

      {isError && (
        <div className="text-center py-32">
          <p className="text-red-400 text-lg">Failed to load games.</p>
          <p className="text-gray-600 text-sm mt-2">Make sure the backend is running on port 3001.</p>
        </div>
      )}

      {!isLoading && games.length === 0 && (
        <div className="text-center py-32">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-gray-300 text-xl font-semibold mb-2">No games found</p>
          {search && <p className="text-gray-500 text-sm">Try a different search term.</p>}
        </div>
      )}

      {games.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {games.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-white/10 transition">
              ← Previous
            </button>
            <span className="text-gray-400 text-sm px-4">
              Page {page} {total > 0 && `of ${Math.ceil(total / 24)}`}
            </span>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data?.next}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-white/10 transition">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
