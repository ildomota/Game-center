import { Link, useLocation } from 'react-router-dom'

const NAV_SECTIONS = [
  {
    items: [
      { label: 'Home', path: '/', icon: 'ti-home' },
    ],
  },
  {
    title: 'New Releases',
    items: [
      { label: 'Last 30 days', path: '/browse?ordering=-released&period=30', icon: 'ti-calendar-event' },
      { label: 'This week', path: '/browse?ordering=-released&period=7', icon: 'ti-flame' },
      { label: 'Next week', path: '/browse?ordering=-released&period=next', icon: 'ti-player-track-next' },
      { label: 'Release calendar', path: '/browse?ordering=-released', icon: 'ti-calendar' },
    ],
  },
  {
    title: 'Top',
    items: [
      { label: 'Best of the year', path: '/browse?ordering=-rating', icon: 'ti-trophy' },
      { label: 'Popular in 2025', path: '/browse?ordering=-ratingsCount', icon: 'ti-chart-bar' },
      { label: 'All time top 250', path: '/browse?ordering=-metacritic', icon: 'ti-crown' },
    ],
  },
  {
    title: 'Browse',
    items: [
      { label: 'All Games', path: '/browse', icon: 'ti-layout-grid' },
      { label: 'Action', path: '/browse?genre=Action', icon: 'ti-sword' },
      { label: 'RPG', path: '/browse?genre=RPG', icon: 'ti-wand' },
      { label: 'Strategy', path: '/browse?genre=Strategy', icon: 'ti-chess' },
      { label: 'Shooter', path: '/browse?genre=Shooter', icon: 'ti-crosshair' },
      { label: 'Adventure', path: '/browse?genre=Adventure', icon: 'ti-map' },
      { label: 'Puzzle', path: '/browse?genre=Puzzle', icon: 'ti-puzzle' },
      { label: 'Racing', path: '/browse?genre=Racing', icon: 'ti-steering-wheel' },
      { label: 'Sports', path: '/browse?genre=Sports', icon: 'ti-ball-football' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path) => {
    const [pathname, search] = path.split('?')
    if (search) {
      return location.pathname === pathname && location.search === '?' + search
    }
    return location.pathname === pathname && !location.search
  }

  return (
    <aside className="w-[240px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-[#081225] py-6 flex-col gap-6 hidden md:flex">
      <nav className="flex flex-col gap-6 px-5 flex-1">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.title && (
              <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
                {section.title}
              </h2>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? 'text-white bg-[#171f33]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[#2a344c]">
                    <i className={`ti ${item.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 mt-2 pb-2">
        <button className="w-full py-3 px-4 bg-white hover:bg-white/90 text-[#050b18] rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2">
          <i className="ti ti-plus" aria-hidden="true" /> Add Game
        </button>
        <p className="text-[11px] text-white/20 text-center mt-3">
          Game data by{' '}
          <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">
            RAWG.io
          </a>
        </p>
      </div>
    </aside>
  )
}
