import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 'Puzzle', 'Racing', 'Sports', 'Simulation', 'Horror']
const ORDERINGS = [
  { label: 'Relevance', value: '-ratingsCount' },
  { label: 'Highest Rated', value: '-rating' },
  { label: 'Newest', value: '-released' },
  { label: 'Best Metacritic', value: '-metacritic' },
]

const PILL =
  'flex items-center gap-2 bg-[#172137] rounded-xl pl-4 pr-2 py-1.5'
const SELECT =
  'bg-transparent border-none text-white text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-6'
const CARET = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 2px center',
}

export default function HomePage() {
  const [ordering, setOrdering] = useState('-ratingsCount')
  const [genre, setGenre] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['games', 'home', ordering, genre, page],
    queryFn: () => getGames({ ordering, genre, page, limit: 20 }),
    keepPreviousData: true,
  })

  const games = data?.results || []
  const total = data?.count || 0

  const reset = (fn) => (e) => { fn(e.target.value); setPage(1) }

  return (
    <div className="w-full px-10 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[64px] font-black leading-none tracking-tight text-white">
          New and trending
        </h1>
        <p className="text-base font-medium text-white/50 mt-3">
          Based on player counts and release date
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className={PILL}>
            <span className="text-sm text-white/40">Order by:</span>
            <select value={ordering} onChange={reset(setOrdering)} className={SELECT} style={CARET}>
              {ORDERINGS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#172137]">{o.label}</option>
              ))}
            </select>
          </div>

          <div className={PILL}>
            <span className="text-sm text-white/40">Genre:</span>
            <select value={genre} onChange={reset(setGenre)} className={SELECT} style={CARET}>
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
            <button className="w-8 h-8 bg-[#26314a] rounded-md flex items-center justify-center" aria-label="Grid view">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#121b2e] rounded-xl aspect-[4/3]" />
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
          <p className="text-white/60 text-xl font-bold">No games found</p>
        </div>
      )}

      {games.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
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
