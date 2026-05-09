'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DayRecord {
  date: string
  focusMinutes: number
  sessions: number
}

interface StatProps {
  history: DayRecord[]
  sessionsToday: number
  focusMinutes: number
}

function fmt(min: number) {
  if (min === 0) return '0m'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function computeLongestStreak(history: DayRecord[], focusMinutes: number) {
  const map = new Map(history.map(r => [r.date, r.focusMinutes]))
  if (focusMinutes > 0) map.set(new Date().toDateString(), focusMinutes)

  const activeDates = [...map.entries()]
    .filter(([, m]) => m > 0)
    .map(([d]) => d)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  let longest = 0
  let cur = 0
  for (let i = 0; i < activeDates.length; i++) {
    if (i === 0) {
      cur = 1
    } else {
      const prev = new Date(activeDates[i - 1])
      const curr = new Date(activeDates[i])
      prev.setDate(prev.getDate() + 1)
      cur = prev.toDateString() === curr.toDateString() ? cur + 1 : 1
    }
    longest = Math.max(longest, cur)
  }
  return longest
}

export default function StatTab({ history, sessionsToday, focusMinutes }: StatProps) {
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds = d.toDateString()
    const isToday = i === 6
    const rec = isToday ? null : history.find(r => r.date === ds)
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      minutes: isToday ? focusMinutes : (rec?.focusMinutes ?? 0),
      sessions: isToday ? sessionsToday : (rec?.sessions ?? 0),
    }
  })

  const thisWeekMin = weekData.reduce((s, d) => s + d.minutes, 0)
  const totalSessions = history.reduce((s, d) => s + d.sessions, 0) + sessionsToday
  const totalMinutes = history.reduce((s, d) => s + d.focusMinutes, 0) + focusMinutes
  const avgSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0

  const map = new Map(history.map(r => [r.date, r.focusMinutes]))
  if (focusMinutes > 0) map.set(new Date().toDateString(), focusMinutes)
  let streak = 0
  for (let i = 0; i <= 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if ((map.get(d.toDateString()) ?? 0) > 0) streak++
    else break
  }

  const longestStreak = computeLongestStreak(history, focusMinutes)
  const daysActive = history.filter(r => r.focusMinutes > 0).length + (sessionsToday > 0 ? 1 : 0)

  return (
    <div className="screen-content" style={{ padding: '24px 20px 20px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Your Stats</div>
      <div style={{ fontSize: 13, color: 'var(--subtext)', marginBottom: 20 }}>
        {totalSessions > 0 ? 'Weekly overview' : 'No data yet — start a focus session!'}
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total this week', val: fmt(thisWeekMin) },
          { label: 'Avg session', val: avgSession > 0 ? `${avgSession}m` : '—' },
          { label: 'Current streak', val: streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : '0 days' },
          { label: 'Longest streak', val: longestStreak > 0 ? `${longestStreak} day${longestStreak > 1 ? 's' : ''}` : '—' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--subtext)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Daily focus time (minutes)</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={weekData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B83A6' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6B83A6' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid var(--secondary)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ fill: '#3B82F6', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* All time summary */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>All time</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{totalSessions}</div>
            <div style={{ fontSize: 11, color: 'var(--subtext)', marginTop: 2 }}>Sessions</div>
          </div>
          <div style={{ width: 1, background: 'var(--secondary)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{fmt(totalMinutes)}</div>
            <div style={{ fontSize: 11, color: 'var(--subtext)', marginTop: 2 }}>Total focus</div>
          </div>
          <div style={{ width: 1, background: 'var(--secondary)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{daysActive}</div>
            <div style={{ fontSize: 11, color: 'var(--subtext)', marginTop: 2 }}>Days active</div>
          </div>
        </div>
      </div>
    </div>
  )
}
