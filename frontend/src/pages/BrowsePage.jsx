import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'
import GameCard from '../components/GameCard'
import SelectPill from '../components/SelectPill'
import { PLATFORM_ITEMS, PLATFORM_LABELS } from '../constants/platforms'

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Shooter', 'Puzzle', 'Racing', 'Sports', 'Simulation', 'Horror']
const GENRE_OPTIONS = [{ label: 'All', value: '' }, ...GENRES.map((g) => ({ label: g, value: g }))]
const PLATFORM_OPTIONS = [{ label: 'All', value: '' }, ...PLATFORM_ITEMS.map((p) => ({ label: p.label, value: p.slug }))]
const ORDERINGS = [
  { label: 'Highest Rated', value: '-rating' },
  { label: 'Newest', value: '-released' },
  { label: 'Most Popular', value: '-ratingsCount' },
  { label: 'Best Metacritic', value: '-metacritic' },
]

// Sidebar "New Releases" shortcuts — translated into an actual released-date range.
const PERIOD_LABELS = { 30: 'Last 30 days', 7: 'This week', next: 'Next week' }

function fmtDate(d) {
  return d.toISOString().slice(0, 10)
}
function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}
function periodToRange(period) {
  const today = new Date()
  if (period === '30') return { releasedFrom: fmtDate(addDays(today, -30)), releasedTo: fmtDate(today) }
  if (period === '7') return { releasedFrom: fmtDate(addDays(today, -7)), releasedTo: fmtDate(today) }
  if (period === 'next') return { releasedFrom: fmtDate(today), releasedTo: fmtDate(addDays(today, 7)) }
  return {}
}

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12'
const PAGER_BTN =
  'h-[50px] px-8 rounded-xl bg-[#171f33] hover:bg-[#202941] text-white text-[15px] font-semibold transition-colors disabled:opacity-30 disabled:hover:bg-[#171f33]'

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre') || ''
  const platform = searchParams.get('platform') || ''
  const ordering = searchParams.get('ordering') || '-rating'
  const period = searchParams.get('period') || ''

  const dateRange = useMemo(() => periodToRange(period), [period])

  useEffect(() => { setPage(1) }, [search, genre, platform, ordering, period])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['games', 'browse', search, genre, platform, ordering, period, page],
    queryFn: () => getGames({ search, genre, platform, ordering, page, limit: 20, ...dateRange }),
    keepPreviousData: true,
  })

  const games = data?.results || []
  const total = data?.count || 0

  const setParam = (key) => (value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const activeLabel = PERIOD_LABELS[period] || ORDERINGS.find((o) => o.value === ordering)?.label || 'Games'

  return (
    <div className="w-full px-12 pt-8 pb-16">

      <h1 className="text-[46px] font-semibold leading-none text-white">
        {search ? `"${search}"` : genre ? genre : platform ? PLATFORM_LABELS[platform] : activeLabel}
      </h1>
      <p className="text-[17px] text-[#c4c7c8] mt-4">
        {total > 0 ? `${total.toLocaleString()} games found` : ' '}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-4 flex-wrap">
          <SelectPill label="Order by" value={ordering} onChange={setParam('ordering')} options={ORDERINGS} />
          <SelectPill label="Genre" value={genre} onChange={setParam('genre')} options={GENRE_OPTIONS} />
          <SelectPill label="Platform" value={platform} onChange={setParam('platform')} options={PLATFORM_OPTIONS} />
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
          {[...Array(20)].map((_, i) => (
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
          <p className="text-white/60 text-xl font-bold mb-2">No games found</p>
          {search && <p className="text-white/30 text-sm">Try a different search term.</p>}
        </div>
      )}

      {games.length > 0 && (
        <>
          <div className={GRID}>
            {games.map((game) => <GameCard key={game.rawgId} game={game} />)}
          </div>

          <div className="mt-16 flex items-center justify-center gap-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={PAGER_BTN}>
              ← Previous
            </button>
            <span className="text-white/50 text-sm font-medium px-2">
              Page {page}{total > 0 && ` of ${Math.ceil(total / 20)}`}
            </span>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data?.next} className={PAGER_BTN}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
