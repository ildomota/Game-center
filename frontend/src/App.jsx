import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import GameDetailPage from './pages/GameDetailPage'
import BrowsePage from './pages/BrowsePage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f1016] flex flex-col w-full">
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
    </div>
  )
}
