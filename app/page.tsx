'use client'

import { useState, useCallback } from 'react'
import HomeTab from '@/components/HomeTab'
import TimerTab from '@/components/TimerTab'
import StatTab from '@/components/StatTab'
import ProfileTab from '@/components/ProfileTab'
import FriendsTab from '@/components/FriendsTab'

type Tab = 'home' | 'timer' | 'stat' | 'friends' | 'profile'

const NavIcon: Record<Tab, React.ReactNode> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12H15V22" />
    </svg>
  ),
  timer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <circle cx="12" cy="12" r="10" /><path d="M12 6V12L16 14" />
    </svg>
  ),
  stat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  friends: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

const NAV_LABEL: Record<Tab, string> = {
  home: 'Home',
  timer: 'Timer',
  stat: 'Stats',
  friends: 'Friends',
  profile: 'Profile',
}

export default function Page() {
  const [tab, setTab] = useState<Tab>('home')
  const [sessionsToday, setSessionsToday] = useState(3)
  const [focusMinutes, setFocusMinutes] = useState(80)

  const handleSessionComplete = useCallback((minutes: number) => {
    setSessionsToday(s => s + 1)
    setFocusMinutes(m => m + minutes)
  }, [])

  const tabs: Tab[] = ['home', 'timer', 'stat', 'friends', 'profile']

  return (
    <div className="app-shell">
      {tab === 'home'    && <HomeTab sessionsToday={sessionsToday} focusMinutes={focusMinutes} />}
      {tab === 'timer'   && <TimerTab onSessionComplete={handleSessionComplete} />}
      {tab === 'stat'    && <StatTab />}
      {tab === 'friends' && <FriendsTab myFocusMinutes={focusMinutes} mySessionsToday={sessionsToday} />}
      {tab === 'profile' && <ProfileTab />}

      {/* Bottom Nav */}
      <nav style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid var(--secondary)',
        display: 'flex', height: 64, zIndex: 10,
        borderRadius: '0 0 24px 24px',
      }}>
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
            {NAV_LABEL[t]}
            {tab === t && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
