'use client'

interface HomeProps {
  sessionsToday: number
  focusMinutes: number
}

export default function HomeTab({ sessionsToday, focusMinutes }: HomeProps) {
  const hours = Math.floor(focusMinutes / 60)
  const mins = focusMinutes % 60
  const focusStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '28px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', fontStyle: 'italic' }}>PinkyPie</span>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--subtext)" strokeWidth="2" style={{ width: 18, height: 18 }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>

      {/* Greeting Card */}
      <div style={{ margin: '0 20px 20px', background: 'var(--accent)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="1.5" style={{ width: 28, height: 28 }}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Good morning, Pinky!</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
            You&apos;ve focused {focusStr} today
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '0 20px 20px' }}>
        {[
          { label: "Today's focus", value: focusStr, sub: '+20m vs yesterday' },
          { label: 'Sessions done', value: sessionsToday, sub: 'Goal: 4 sessions' },
          { label: 'Streak', value: '7 days', sub: 'Keep going!' },
          { label: 'This week', value: '8h 40m', sub: '+1h vs last week' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--subtext)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--accent-dark)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', padding: '0 24px 10px' }}>Today&apos;s tasks</div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { name: 'Morning deep work', time: 'Completed · 25 min', dot: '#C8E6C9', badge: 'Done', badgeBg: 'var(--secondary)', badgeColor: 'var(--accent-dark)' },
          { name: 'Study session', time: 'In progress · 50 min', dot: 'var(--accent)', badge: 'Now', badgeBg: 'var(--accent)', badgeColor: '#fff' },
          { name: 'Evening review', time: 'Upcoming · 25 min', dot: 'var(--accent-light)', badge: 'Later', badgeBg: 'var(--secondary)', badgeColor: 'var(--accent-dark)' },
        ].map((t, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--subtext)', marginTop: 2 }}>{t.time}</div>
            </div>
            <div style={{ fontSize: 11, background: t.badgeBg, color: t.badgeColor, padding: '4px 8px', borderRadius: 8 }}>{t.badge}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
