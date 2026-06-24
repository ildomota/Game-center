import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#081225] h-16 flex items-center px-6 gap-8 shrink-0">

      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 shrink-0 w-[240px]">
        <span className="text-white font-black text-xl tracking-tight">
          Game<span className="text-indigo-500">Center</span>
        </span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-[#172137] border-none rounded-full px-6 py-2.5 text-[13px] text-white placeholder-[#9aa5ba] focus:bg-white focus:text-black focus:placeholder-black/40 transition-all outline-none"
          />
        </div>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-5 ml-auto shrink-0">
        <Link to="/browse" className="text-[12px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors">
          Browse
        </Link>
        <Link to="/about" className="text-[12px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors">
          Log in
        </Link>
        <Link to="/about" className="text-[12px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors">
          Sign up
        </Link>
        <button className="text-white/50 hover:text-white transition-colors" aria-label="Notifications">
          <i className="ti ti-bell" style={{ fontSize: 19 }} aria-hidden="true" />
        </button>
        <Link to="/about" className="text-white/50 hover:text-white transition-colors" aria-label="Settings">
          <i className="ti ti-settings" style={{ fontSize: 19 }} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  )
}
