'use client'

import { useState, useCallback } from 'react'
import HomeTab from '@/components/HomeTab'
import TimerTab from '@/components/TimerTab'
import StatTab from '@/components/StatTab'
import ProfileTab from '@/components/ProfileTab'

type Tab = 'home' | 'timer' | 'stat' | 'profile'

const NavIcon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  ),
  timer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  stat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

export default function Page() {
  const [tab, setTab] = useState<Tab>('home')
  const [sessionsToday, setSessionsToday] = useState(3)
  const [focusMinutes, setFocusMinutes] = useState(80)

  const handleSessionComplete = useCallback((minutes: number) => {
    setSessionsToday(s => s + 1)
    setFocusMinutes(m => m + minutes)
  }, [])

  const tabs: Tab[] = ['home', 'timer', 'stat', 'profile']

  return (
    <div className="app-shell">
      {/* Scrollable content — each tab manages its own inner padding */}
      <div className="screen-content">
        {tab === 'home' && <HomeTab sessionsToday={sessionsToday} focusMinutes={focusMinutes} />}
        {tab === 'timer' && <TimerTab onSessionComplete={handleSessionComplete} />}
        {tab === 'stat' && <StatTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>

      {/* Bottom Nav — always at the bottom, never scrolls away */}
      <nav className="bottom-nav">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, border: 'none', background: 'transparent',
              cursor: 'pointer', fontSize: 10, fontWeight: 500, padding: '8px 0',
              color: tab === t ? 'var(--accent-dark)' : 'var(--subtext)',
              transition: 'color 0.2s',
            }}
          >
            {NavIcon[t]}
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {tab === t && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
