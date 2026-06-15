import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGames } from '../api/games'

export default function AboutPage() {
  const { data } = useQuery({
    queryKey: ['games', 'count'],
    queryFn: () => getGames({ limit: 1 }),
  })

  const totalGames = data?.count || 0

  const features = [
    {
      icon: '🎮',
      title: 'Massive Library',
      desc: 'Thousands of games across all platforms, genres, and generations — automatically growing every day.',
    },
    {
      icon: '🤖',
      title: 'Automated Daily Updates',
      desc: 'A GitHub Actions workflow fetches 100 new games from RAWG every night at 3am UTC. No manual work required.',
    },
    {
      icon: '💰',
      title: 'Live Steam Pricing',
      desc: 'Real-time prices pulled directly from Steam, including active discounts and sale percentages.',
    },
    {
      icon: '📊',
      title: 'Rich Game Data',
      desc: 'Metacritic scores, player ratings, screenshots, system requirements, platforms, and more — all in one place.',
    },
    {
      icon: '🔍',
      title: 'Powerful Search',
      desc: 'Filter by genre, sort by rating, release date, or Metacritic score to find exactly what you\'re looking for.',
    },
    {
      icon: '⚡',
      title: 'Fast & Responsive',
      desc: 'Built with React, Vite, and Tailwind CSS. Data cached in PostgreSQL on Supabase for instant load times.',
    },
  ]

  const stack = [
    { name: 'React + Vite', desc: 'Frontend framework' },
    { name: 'Tailwind CSS', desc: 'Styling' },
    { name: 'TanStack Query', desc: 'Data fetching & caching' },
    { name: 'Node.js + Express', desc: 'Backend API' },
    { name: 'Prisma ORM', desc: 'Database layer' },
    { name: 'PostgreSQL', desc: 'Database' },
    { name: 'Supabase', desc: 'Hosted database' },
    { name: 'RAWG API', desc: 'Game data source' },
    { name: 'Steam API', desc: 'Live pricing' },
    { name: 'GitHub Actions', desc: 'Daily automation' },
  ]

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 py-16">

      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
          <span className="text-indigo-400 text-sm font-medium">Open Source Project</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Game<span className="text-indigo-400">Center</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          A personal game discovery platform that automatically builds and grows its library every day. Browse thousands of games, check live prices, and discover what to play next.
        </p>
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-center">
            <p className="text-4xl font-bold text-white mb-1">{totalGames.toLocaleString()}+</p>
            <p className="text-gray-500 text-sm">Games in library</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-center">
            <p className="text-4xl font-bold text-white mb-1">100</p>
            <p className="text-gray-500 text-sm">New games daily</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-center">
            <p className="text-4xl font-bold text-white mb-1">Live</p>
            <p className="text-gray-500 text-sm">Steam pricing</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What it does</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Tech Stack</h2>
        <p className="text-gray-500 text-center mb-12">Built with modern tools for performance and reliability</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stack.map((t) => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-white font-semibold text-sm mb-1">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 border border-indigo-500/20 rounded-3xl p-16">
        <h2 className="text-3xl font-bold text-white mb-4">Start exploring</h2>
        <p className="text-gray-400 mb-8">Discover your next favourite game</p>
        <div className="flex justify-center gap-4">
          <Link to="/browse"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Browse Games
          </Link>
          <Link to="/"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Go Home
          </Link>
        </div>
      </section>
    </div>
  )
}
