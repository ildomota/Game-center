import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'

const RESULT_LIMIT = 6

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  const { data: countData } = useQuery({
    queryKey: ['games', 'count'],
    queryFn: () => getGames({ limit: 1 }),
  })
  const placeholder = countData?.count ? `Search ${countData.count.toLocaleString()} games` : 'Search games'

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  const { data, isFetching } = useQuery({
    queryKey: ['games', 'live-search', debouncedQuery],
    queryFn: () => getGames({ search: debouncedQuery, limit: RESULT_LIMIT, ordering: '-ratingsCount' }),
    enabled: debouncedQuery.length > 1,
  })
  const results = debouncedQuery.length > 1 ? data?.results || [] : []
  const showDropdown = open && debouncedQuery.length > 1

  // Close the dropdown on an outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const goToResults = () => {
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const goToGame = (slug) => {
    navigate(`/game/${slug}`)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    goToResults()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0b1326] h-16 flex items-center px-12 gap-8 shrink-0">

      <Link to="/" className="shrink-0 text-white font-bold text-[21px] tracking-tight leading-none">
        GameCenter
      </Link>

      <div ref={wrapperRef} className="relative w-[395px] max-w-full">
        <form onSubmit={handleSearch}>
          <div className="relative group">
            <i
              className="ti ti-search absolute left-[18px] top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-black/50 transition-colors"
              style={{ fontSize: 16 }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoComplete="off"
              className="w-full h-11 bg-[#192034] border-none rounded-full pl-14 pr-5 text-[14px] text-white placeholder-white/45 focus:bg-white focus:text-black focus:placeholder-black/40 transition-colors outline-none"
            />
          </div>
        </form>

        {showDropdown && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-[#131b2e] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden py-2">
            {isFetching && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-white/40">Searching…</p>
            )}

            {!isFetching && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-white/40">No games found for "{debouncedQuery}"</p>
            )}

            {results.map((game) => (
              <button
                key={game.rawgId}
                onClick={() => goToGame(game.slug)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/[0.06] transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#0f1423] shrink-0">
                  {game.backgroundImage && (
                    <img src={game.backgroundImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-[13px] font-semibold truncate">{game.name}</p>
                  {game.released && <p className="text-white/40 text-[11px] mt-0.5">{game.released.slice(0, 4)}</p>}
                </div>
                {game.metacritic && (
                  <span className="text-[11px] font-bold text-[#6ee07b] shrink-0">{game.metacritic}</span>
                )}
              </button>
            ))}

            {results.length > 0 && (
              <button
                onClick={goToResults}
                className="w-full px-4 py-2.5 mt-1 border-t border-white/[0.06] text-[13px] font-semibold text-white/70 hover:text-white transition-colors text-left"
              >
                See all results for "{debouncedQuery}"
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 ml-auto shrink-0">
        <Link to="/about" className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-white transition-colors">
          Log in
        </Link>
        <Link to="/about" className="text-[11px] font-bold uppercase tracking-wider text-white/85 hover:text-white transition-colors">
          Sign up
        </Link>
        <button className="text-white/85 hover:text-white transition-colors" aria-label="Notifications">
          <i className="ti ti-bell" style={{ fontSize: 18 }} aria-hidden="true" />
        </button>
        <Link to="/about" className="text-white/85 hover:text-white transition-colors" aria-label="Settings">
          <i className="ti ti-settings" style={{ fontSize: 19 }} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  )
}
