import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import GameDetailPage from './pages/GameDetailPage'
import BrowsePage from './pages/BrowsePage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/game/:slug" element={<GameDetailPage />} />
      </Routes>
    </div>
  )
}
