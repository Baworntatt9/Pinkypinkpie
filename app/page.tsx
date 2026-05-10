'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import HomeTab from '@/components/HomeTab'
import TimerTab from '@/components/TimerTab'
import StatTab from '@/components/StatTab'
import ProfileTab from '@/components/ProfileTab'

export interface DayRecord {
  date: string
  focusMinutes: number
  sessions: number
}

export interface Task {
  id: string
  name: string
  status: 'upcoming' | 'active' | 'done'
  estimatedMinutes?: number
}

export interface Profile {
  name: string
  dailyGoal: number
}

type Tab = 'home' | 'timer' | 'stat' | 'profile'

const STATS_KEY = 'pinky_daily_stats'
const HISTORY_KEY = 'pinky_history'
const TASKS_KEY = 'pinky_tasks'
const PROFILE_KEY = 'pinky_profile'

function todayStr() { return new Date().toDateString() }

function loadDailyStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return { sessionsToday: 0, focusMinutes: 0 }
    const data = JSON.parse(raw)
    if (data.date !== todayStr()) return { sessionsToday: 0, focusMinutes: 0 }
    return { sessionsToday: data.sessionsToday ?? 0, focusMinutes: data.focusMinutes ?? 0 }
  } catch { return { sessionsToday: 0, focusMinutes: 0 } }
}

function saveDailyStats(sessions: number, minutes: number) {
  localStorage.setItem(STATS_KEY, JSON.stringify({
    sessionsToday: sessions,
    focusMinutes: minutes,
    date: todayStr(),
  }))
}

function loadHistory(): DayRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveHistory(h: DayRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? { name: 'Focuser', dailyGoal: 4, ...JSON.parse(raw) } : { name: 'Focuser', dailyGoal: 4 }
  } catch { return { name: 'Focuser', dailyGoal: 4 } }
}

function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
}

function computeStreak(history: DayRecord[], todayMinutes: number) {
  const map = new Map(history.map(r => [r.date, r.focusMinutes]))
  if (todayMinutes > 0) map.set(todayStr(), todayMinutes)
  let streak = 0
  for (let i = 0; i <= 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if ((map.get(d.toDateString()) ?? 0) > 0) streak++
    else break
  }
  return streak
}

function computeThisWeek(history: DayRecord[], todayMinutes: number) {
  const map = new Map(history.map(r => [r.date, r.focusMinutes]))
  map.set(todayStr(), todayMinutes)
  let total = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    total += map.get(d.toDateString()) ?? 0
  }
  return total
}

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
  profile: 'Profile',
}

export default function Page() {
  const [tab, setTab] = useState<Tab>('home')
  const [sessionsToday, setSessionsToday] = useState(0)
  const [focusMinutes, setFocusMinutes] = useState(0)
  const [history, setHistory] = useState<DayRecord[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [profile, setProfile] = useState<Profile>({ name: 'Focuser', dailyGoal: 4 })
  const loaded = useRef(false)

  useEffect(() => {
    // Archive previous day before resetting
    try {
      const raw = localStorage.getItem(STATS_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        if (data.date !== todayStr() && (data.focusMinutes ?? 0) > 0) {
          const hist = loadHistory()
          if (!hist.find(r => r.date === data.date)) {
            const cutoff = new Date()
            cutoff.setDate(cutoff.getDate() - 30)
            const newHist = [...hist, { date: data.date, focusMinutes: data.focusMinutes, sessions: data.sessionsToday ?? 0 }]
              .filter(r => new Date(r.date) >= cutoff)
            saveHistory(newHist)
          }
        }
      }
    } catch {}

    const stats = loadDailyStats()
    const hist = loadHistory()
    setSessionsToday(stats.sessionsToday)
    setFocusMinutes(stats.focusMinutes)
    setHistory(hist)
    setTasks(loadTasks())
    setProfile(loadProfile())
    loaded.current = true
  }, [])

  useEffect(() => {
    if (!loaded.current) return
    saveDailyStats(sessionsToday, focusMinutes)
  }, [sessionsToday, focusMinutes])

  const handleSessionComplete = useCallback((minutes: number) => {
    setSessionsToday(s => s + 1)
    setFocusMinutes(m => m + minutes)
  }, [])

  const handleTasksChange = useCallback((newTasks: Task[]) => {
    setTasks(newTasks)
    saveTasks(newTasks)
  }, [])

  const handleProfileChange = useCallback((p: Profile) => {
    setProfile(p)
    saveProfile(p)
  }, [])

  const streak = computeStreak(history, focusMinutes)
  const thisWeekMin = computeThisWeek(history, focusMinutes)

  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterdayMin = history.find(r => r.date === yesterdayDate.toDateString())?.focusMinutes ?? null

  const tabs: Tab[] = ['home', 'timer', 'stat', 'profile']

  return (
    <div className="app-shell">
      <div style={{
        position: 'absolute',
        inset: 0,
        bottom: 64,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {tab === 'home' && (
          <HomeTab
            sessionsToday={sessionsToday}
            focusMinutes={focusMinutes}
            streak={streak}
            thisWeekMinutes={thisWeekMin}
            yesterdayMinutes={yesterdayMin}
            tasks={tasks}
            dailyGoal={profile.dailyGoal}
            onTasksChange={handleTasksChange}
          />
        )}
        {tab === 'timer' && (
          <TimerTab
            onSessionComplete={handleSessionComplete}
            sessionsToday={sessionsToday}
            focusMinutes={focusMinutes}
            dailyGoal={profile.dailyGoal}
          />
        )}
        {tab === 'stat' && (
          <StatTab
            history={history}
            sessionsToday={sessionsToday}
            focusMinutes={focusMinutes}
          />
        )}
        {tab === 'profile' && (
          <ProfileTab
            profile={profile}
            history={history}
            sessionsToday={sessionsToday}
            focusMinutes={focusMinutes}
            onProfileChange={handleProfileChange}
          />
        )}
      </div>

      <nav style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid var(--secondary)',
        display: 'flex', height: 64, zIndex: 10,
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
