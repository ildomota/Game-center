import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'
import SelectPill from '../components/SelectPill'

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 'Puzzle', 'Racing', 'Sports', 'Simulation', 'Horror']
const GENRE_OPTIONS = [{ label: 'All', value: '' }, ...GENRES.map((g) => ({ label: g, value: g }))]
const ORDERINGS = [
  { label: 'Trending', value: 'trending' },
  { label: 'Highest Rated', value: '-rating' },
  { label: 'Newest', value: '-released' },
  { label: 'Best Metacritic', value: '-metacritic' },
]

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12'

export default function HomePage() {
  const [ordering, setOrdering] = useState('trending')
  const [genre, setGenre] = useState('')

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['games', 'home', ordering, genre],
    queryFn: ({ pageParam }) => getGames({ ordering, genre, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  })

  const games = data?.pages.flatMap((p) => p.results) || []
  const total = data?.pages[0]?.count || 0

  return (
    <div className="w-full px-12 pt-8 pb-16">

      <h1 className="text-[46px] font-semibold leading-none text-white">New and trending</h1>
      <p className="text-[17px] text-[#c4c7c8] mt-4">Based on player counts and release date</p>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-4 flex-wrap">
          <SelectPill label="Order by" value={ordering} onChange={setOrdering} options={ORDERINGS} />
          <SelectPill label="Genre" value={genre} onChange={setGenre} options={GENRE_OPTIONS} />
        </div>

        <div className="flex items-center gap-5 shrink-0">
          <span className="text-[11px] font-semibold text-[#c4c7c8] uppercase tracking-wide">Display options:</span>
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[#151d30]">
            <button className="w-7 h-9 rounded-md bg-[#2d3449] text-white flex items-center justify-center" aria-label="Grid view">
              <i className="ti ti-layout-grid" style={{ fontSize: 15 }} aria-hidden="true" />
            </button>
            <button className="w-7 h-9 rounded-md text-white/60 hover:text-white flex items-center justify-center" aria-label="List view">
              <i className="ti ti-layout-list" style={{ fontSize: 15 }} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className={GRID}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-[#131b2e] aspect-[280/304]" />
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
          <div className={GRID}>
            {games.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>

          {hasNextPage && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="h-[50px] px-12 rounded-xl bg-[#171f33] hover:bg-[#202941] text-white text-[15px] font-semibold transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading…' : 'Show more'}
              </button>
            </div>
          )}

          {!hasNextPage && total > 0 && (
            <p className="mt-16 text-center text-white/30 text-sm">
              Showing all {total.toLocaleString()} games
            </p>
          )}
        </>
      )}
    </div>
  )
}
