import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import GameDetailPage from './pages/GameDetailPage'
import BrowsePage from './pages/BrowsePage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#081225] flex flex-col w-full">
      {/* Top navbar — full width */}
      <Navbar />

      {/* Body — sidebar + content side by side */}
      <div className="flex flex-1 w-full pt-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/game/:slug" element={<GameDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>

      {/* Floating action button */}
      <button
        className="fixed right-8 bottom-8 w-14 h-14 rounded-full bg-white text-[#071123] grid place-items-center shadow-lg shadow-black/40 hover:scale-105 transition-transform z-50"
        aria-label="Add game"
      >
        <i className="ti ti-plus" style={{ fontSize: 28 }} aria-hidden="true" />
      </button>
    </div>
  )
}
