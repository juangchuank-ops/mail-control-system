import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useInterval, useT } from '../../hooks'
import { cn } from '../../lib/cn'
import { formatClock, formatDate } from '../../lib/format'
import type { MessageKey } from '../../lib/i18n'
import { StatusLed } from '../ui'

const NAV_ITEMS: ReadonlyArray<{ to: string; label: MessageKey; end: boolean }> = [
  { to: '/', label: 'nav.console', end: true },
  { to: '/accounts', label: 'nav.nodes', end: false },
  { to: '/settings', label: 'nav.settings', end: false },
  { to: '/about', label: 'nav.about', end: false },
]

/** 系统顶栏：品牌字标 + 等宽导航 + 模式标记 + 实时时钟 */
export function SystemHeader() {
  const t = useT()
  const [now, setNow] = useState(() => Date.now())
  const [menuOpen, setMenuOpen] = useState(false)

  useInterval(() => setNow(Date.now()), 1000)

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-line bg-surface-0/95 backdrop-blur-[2px]">
      <div className="flex h-[var(--header-h)] items-stretch">
        <div className="flex items-center gap-3 border-r border-line px-4">
          <span className="mcs-led mcs-led--signal" aria-hidden="true" />
          <div className="leading-none">
            <NavLink to="/" className="font-mono text-[12px] tracking-[0.22em] text-ink-0">
              MAIL CONTROL
            </NavLink>
            <p className="mcs-label mt-1 hidden sm:block">{t('header.subtitle')}</p>
          </div>
        </div>

        <nav className="hidden flex-1 items-stretch md:flex" aria-label={t('nav.primary')}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'mcs-label flex items-center border-r border-line px-4 transition-colors duration-[var(--motion-ui)]',
                  isActive
                    ? 'bg-panel-1 text-signal'
                    : 'text-ink-2 hover:bg-panel-0 hover:text-ink-0',
                )
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 px-4">
          <span className="mcs-label hidden items-center gap-2 border border-line px-2 py-1 text-warn sm:flex">
            <StatusLed tone="warn" />
            {t('header.demo')}
          </span>
          <div className="hidden text-right lg:block">
            <p className="mcs-num text-[12px] text-ink-1">{formatClock(now)}</p>
            <p className="mcs-label">{formatDate(now)}</p>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? t('nav.close') : t('nav.open')}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((open) => !open)
            }}
            className="mcs-btn mcs-btn--icon md:hidden"
          >
            {menuOpen ? <X size={16} strokeWidth={1.75} /> : <Menu size={16} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-line bg-panel-0 md:hidden" aria-label={t('nav.mobile')}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => {
                setMenuOpen(false)
              }}
              className={({ isActive }) =>
                cn(
                  'mcs-label flex items-center border-b border-line px-4 py-3',
                  isActive ? 'text-signal' : 'text-ink-2',
                )
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
