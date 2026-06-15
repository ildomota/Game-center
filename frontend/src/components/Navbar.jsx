import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/browse?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0d0d1a]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        <Link to="/" className="text-white font-bold text-xl tracking-tight shrink-0">
          <span className="text-indigo-400">Game</span>Center
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </form>

        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="text-gray-300 hover:text-white text-sm transition">Home</Link>
          <Link to="/browse" className="text-gray-300 hover:text-white text-sm transition">Browse</Link>
        </div>
      </div>
    </nav>
  )
}
