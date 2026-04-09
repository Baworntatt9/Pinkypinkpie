'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'

const weekData = [
  { day: 'Mon', minutes: 50, switches: 3 },
  { day: 'Tue', minutes: 70, switches: 5 },
  { day: 'Wed', minutes: 90, switches: 2 },
  { day: 'Thu', minutes: 60, switches: 8 },
  { day: 'Fri', minutes: 100, switches: 2 },
  { day: 'Sat', minutes: 80, switches: 4 },
  { day: 'Sun', minutes: 30, switches: 0 },
]

const achievements = [
  { icon: '🔥', name: '7-day streak', desc: 'Focused every day this week', val: '×7' },
  { icon: '⭐', name: 'Deep work', desc: '3+ hours in a single day', val: '×2' },
  { icon: '🎯', name: 'Goal crusher', desc: 'Hit daily goal 5 days straight', val: '×1' },
]

export default function StatTab() {
  return (
    <div className="screen-content" style={{ padding: '24px 20px 8px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Your Stats</div>
      <div style={{ fontSize: 13, color: 'var(--subtext)', marginBottom: 20 }}>Weekly overview · Mock data</div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total this week', val: '8h 40m', delta: '▲ 12% vs last week', deltaColor: '#6dbb7a' },
          { label: 'Avg session', val: '24m', delta: '▲ 3m vs last week', deltaColor: '#6dbb7a' },
          { label: 'Focus score', val: '87%', delta: 'Stay in app: 91%', deltaColor: 'var(--subtext)' },
          { label: 'Longest streak', val: '7 days', delta: 'Personal best!', deltaColor: '#6dbb7a' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--subtext)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{c.val}</div>
            <div style={{ fontSize: 12, color: c.deltaColor, marginTop: 2 }}>{c.delta}</div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Daily focus time (minutes)</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={weekData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE4E4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#A67C7C' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#A67C7C' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid var(--secondary)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="minutes"
              stroke="#FF9EAA"
              strokeWidth={2.5}
              dot={{ fill: '#FF9EAA', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#E87A8A', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Distraction */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Focus quality · Tab switches</div>
        <div style={{ fontSize: 12, color: 'var(--subtext)', marginBottom: 12 }}>Fewer switches = better focus</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weekData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE4E4" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#A67C7C' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#A67C7C' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid var(--secondary)', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: 'var(--text)', fontWeight: 600 }}
            />
            <Bar dataKey="switches" fill="#FFB3BF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: 12, color: 'var(--subtext)', marginTop: 8 }}>Best day: Friday — only 2 tab switches</div>
      </div>

      {/* Achievements */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Achievements</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {achievements.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, background: '#fff', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ width: 36, height: 36, background: 'var(--secondary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{a.name}</div>
              <div style={{ fontSize: 12, color: 'var(--subtext)' }}>{a.desc}</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-dark)' }}>{a.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
