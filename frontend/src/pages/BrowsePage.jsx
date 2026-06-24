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
  const total = data?.count || 0

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const activeLabel = ORDERINGS.find(o => o.value === ordering)?.label || 'Games'

  return (
    <div className="w-full px-10 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[64px] font-black leading-none tracking-tight text-white">
          {search ? `"${search}"` : genre ? genre : activeLabel}
        </h1>
        {total > 0 && (
          <p className="text-base font-medium text-white/50 mt-2">
            {total.toLocaleString()} games found
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Order by pill dropdown */}
          <div className="flex items-center gap-2 bg-[#172137] rounded-lg pl-3 pr-1 py-1">
            <span className="text-sm text-white/40">Order by:</span>
            <select
              value={ordering}
              onChange={(e) => setParam('ordering', e.target.value)}
              className="bg-transparent border-none text-white text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 2px center' }}
            >
              {ORDERINGS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#172137]">{o.label}</option>
              ))}
            </select>
          </div>

          {/* Genre pill dropdown */}
          <div className="flex items-center gap-2 bg-[#172137] rounded-lg pl-3 pr-1 py-1">
            <span className="text-sm text-white/40">Genre:</span>
            <select
              value={genre}
              onChange={(e) => setParam('genre', e.target.value)}
              className="bg-transparent border-none text-white text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 2px center' }}
            >
              <option value="" className="bg-[#172137]">All</option>
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-[#172137]">{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Display options */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Display options:</span>
          <div className="flex items-center bg-[#172137] rounded-lg p-1 gap-1">
            <button className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center" aria-label="Grid view">
              <i className="ti ti-layout-grid text-white" style={{ fontSize: 15 }} aria-hidden="true" />
            </button>
            <button className="w-8 h-8 rounded-md flex items-center justify-center text-white/40 hover:text-white" aria-label="List view">
              <i className="ti ti-list" style={{ fontSize: 15 }} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#172137] rounded-xl aspect-[4/3]" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-32">
          <p className="text-red-400 text-lg">Failed to load games.</p>
          <p className="text-white/30 text-sm mt-2">Make sure the backend is running on port 3001.</p>
        </div>
      )}

      {!isLoading && games.length === 0 && (
        <div className="text-center py-32">
          <p className="text-white/60 text-xl font-bold mb-2">No games found</p>
          {search && <p className="text-white/30 text-sm">Try a different search term.</p>}
        </div>
      )}

      {games.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {games.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>

          <div className="mt-16 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-[#172137] hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-30 disabled:hover:bg-[#172137] disabled:hover:text-white"
            >
              ← Previous
            </button>
            <span className="text-white/50 text-sm font-medium px-2">
              Page {page}{total > 0 && ` of ${Math.ceil(total / 20)}`}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.next}
              className="bg-[#172137] hover:bg-white hover:text-black text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-30 disabled:hover:bg-[#172137] disabled:hover:text-white"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
