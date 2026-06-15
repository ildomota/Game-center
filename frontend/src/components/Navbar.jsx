import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
      <div className="w-full max-w-[1400px] mx-auto px-8 h-16 flex items-center gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 6H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V7a1 1 0 00-1-1zm-10 8H8v1a1 1 0 01-2 0v-1H5a1 1 0 010-2h1v-1a1 1 0 012 0v1h3a1 1 0 010 2zm4.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight shrink-0">
            Game<span className="text-indigo-400">Center</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {[['/', 'Home'], ['/browse', 'Browse'], ['/about', 'About']].map(([path, label]) => (
            <Link key={path} to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(path) ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
            />
          </div>
        </form>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-400 hover:text-white ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/5 px-8 py-4 flex flex-col gap-1">
          {[['/', 'Home'], ['/browse', 'Browse'], ['/about', 'About']].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition">
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
