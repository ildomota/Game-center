import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0a0a0f] mt-20">
      <div className="w-full max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V7a1 1 0 00-1-1zm-10 8H8v1a1 1 0 01-2 0v-1H5a1 1 0 010-2h1v-1a1 1 0 012 0v1h3a1 1 0 010 2zm4.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                </svg>
              </div>
              <span className="text-white font-bold">Game<span className="text-indigo-400">Center</span></span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">Your personal game library, powered by RAWG and updated daily.</p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Navigation</p>
              <div className="flex flex-col gap-2">
                {[['/', 'Home'], ['/browse', 'Browse'], ['/about', 'About']].map(([path, label]) => (
                  <Link key={path} to={path} className="text-gray-600 hover:text-gray-300 text-sm transition">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Data</p>
              <div className="flex flex-col gap-2">
                <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 text-sm transition">RAWG API</a>
                <a href="https://store.steampowered.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-300 text-sm transition">Steam</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-center text-gray-700 text-xs">
          © {new Date().getFullYear()} GameCenter — Game data by RAWG.io
        </div>
      </div>
    </footer>
  )
}
