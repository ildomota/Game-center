import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PLATFORM_ITEMS } from '../constants/platforms'

const NAV_SECTIONS = [
  {
    title: 'Home',
    items: [
      { label: 'Home', path: '/', icon: 'ti-home' },
      { label: 'Reviews', path: '/about', icon: 'ti-photo' },
    ],
  },
  {
    title: 'New Releases',
    items: [
      { label: 'Last 30 days', path: '/browse?ordering=-released&period=30', icon: 'ti-calendar-event' },
      { label: 'This week', path: '/browse?ordering=-released&period=7', icon: 'ti-flame' },
      { label: 'Next week', path: '/browse?ordering=released&period=next', icon: 'ti-player-track-next' },
      { label: 'Release calendar', path: '/browse?ordering=-released', icon: 'ti-calendar' },
    ],
  },
  {
    title: 'Top',
    items: [
      { label: 'Best of the year', path: '/browse?ordering=-rating', icon: 'ti-trophy' },
      { label: 'Popular in 2025', path: '/browse?ordering=-ratingsCount', icon: 'ti-chart-bar' },
    ],
  },
]

const PLATFORMS_COLLAPSED_COUNT = 3

function PlatformIcon({ item }) {
  if (item.svgPath) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }} aria-hidden="true">
        <path d={item.svgPath} />
      </svg>
    )
  }
  return <i className={`ti ${item.icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
}

export default function Sidebar() {
  const location = useLocation()
  const [platformsExpanded, setPlatformsExpanded] = useState(false)

  const isActive = (path) => {
    const [pathname, search] = path.split('?')
    if (search) {
      return location.pathname === pathname && location.search === '?' + search
    }
    return location.pathname === pathname && !location.search
  }

  const visiblePlatforms = platformsExpanded ? PLATFORM_ITEMS : PLATFORM_ITEMS.slice(0, PLATFORMS_COLLAPSED_COUNT)

  return (
    <aside className="w-[276px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b1326] px-8 pt-6 pb-6 hidden md:flex flex-col">
      <nav className="flex flex-col gap-7">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-[22px] font-semibold text-white mb-4">{section.title}</h2>
            <div className="flex flex-col gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-1.5 py-[7px] rounded-xl text-[15px] transition-colors ${
                    isActive(item.path)
                      ? 'text-white font-semibold bg-[#171f31]'
                      : 'text-white/85 font-normal hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#2d3449]">
                    <i className={`ti ${item.icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h2 className="text-[22px] font-semibold text-white mb-4">Platforms</h2>
          <div className="flex flex-col gap-3">
            {visiblePlatforms.map((item) => {
              const path = `/browse?platform=${item.slug}`
              return (
                <Link
                  key={item.slug}
                  to={path}
                  className={`flex items-center gap-3.5 px-1.5 py-[7px] rounded-xl text-[15px] transition-colors ${
                    isActive(path)
                      ? 'text-white font-semibold bg-[#171f31]'
                      : 'text-white/85 font-normal hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#2d3449]">
                    <PlatformIcon item={item} />
                  </div>
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <button
              onClick={() => setPlatformsExpanded((v) => !v)}
              className="flex items-center gap-3.5 px-1.5 py-[7px] rounded-xl text-[15px] text-white/40 hover:text-white/70 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <i className={`ti ${platformsExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`} style={{ fontSize: 16 }} aria-hidden="true" />
              </div>
              <span>{platformsExpanded ? 'Hide' : 'Show all'}</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}
