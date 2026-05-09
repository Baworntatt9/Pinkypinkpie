'use client'

import { useState } from 'react'

interface Task {
  id: string
  name: string
  status: 'upcoming' | 'active' | 'done'
  estimatedMinutes?: number
}

interface HomeProps {
  sessionsToday: number
  focusMinutes: number
  streak: number
  thisWeekMinutes: number
  yesterdayMinutes: number | null
  tasks: Task[]
  dailyGoal: number
  onTasksChange: (tasks: Task[]) => void
}

function fmt(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function greet() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeTab({
  sessionsToday, focusMinutes, streak, thisWeekMinutes,
  yesterdayMinutes, tasks, dailyGoal, onTasksChange,
}: HomeProps) {
  const [addingTask, setAddingTask] = useState(false)
  const [newName, setNewName] = useState('')
  const [newMins, setNewMins] = useState(25)

  const focusStr = fmt(focusMinutes)
  const weekStr = fmt(thisWeekMinutes)

  let vsYesterday: { text: string; color: string } | null = null
  if (yesterdayMinutes !== null) {
    const diff = focusMinutes - yesterdayMinutes
    vsYesterday = {
      text: diff === 0 ? 'Same as yesterday' : diff > 0 ? `+${fmt(diff)} vs yesterday` : `-${fmt(Math.abs(diff))} vs yesterday`,
      color: diff >= 0 ? '#6dbb7a' : '#E87A8A',
    }
  }

  const active = tasks.find(t => t.status === 'active')
  const upcoming = tasks.filter(t => t.status === 'upcoming')
  const done = tasks.filter(t => t.status === 'done')
  const sorted = [...(active ? [active] : []), ...upcoming, ...done]

  const startTask = (id: string) => {
    onTasksChange(tasks.map(t =>
      t.id === id ? { ...t, status: 'active' as const }
        : t.status === 'active' ? { ...t, status: 'upcoming' as const }
        : t
    ))
  }

  const doneTask = (id: string) => {
    onTasksChange(tasks.map(t => t.id === id ? { ...t, status: 'done' as const } : t))
  }

  const removeTask = (id: string) => {
    onTasksChange(tasks.filter(t => t.id !== id))
  }

  const addTask = () => {
    if (!newName.trim()) return
    onTasksChange([...tasks, {
      id: Date.now().toString(),
      name: newName.trim(),
      status: 'upcoming',
      estimatedMinutes: newMins,
    }])
    setNewName('')
    setNewMins(25)
    setAddingTask(false)
  }

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '28px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', fontStyle: 'italic' }}>RainbowDeep</span>
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
          <span style={{ fontSize: 28, lineHeight: 1 }}>🐷</span>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{greet()}, Pinky!</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
            {focusMinutes > 0 ? `You've focused ${focusStr} today` : 'Ready to start focusing?'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '0 20px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--subtext)', marginBottom: 6 }}>Today&apos;s focus</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{focusStr}</div>
          <div style={{ fontSize: 11, marginTop: 2, color: vsYesterday?.color ?? 'var(--subtext)' }}>
            {vsYesterday?.text ?? 'Start your first session!'}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--subtext)', marginBottom: 6 }}>Sessions done</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{sessionsToday}</div>
          <div style={{ fontSize: 11, marginTop: 2, color: sessionsToday >= dailyGoal ? '#6dbb7a' : 'var(--accent-dark)' }}>
            Goal: {dailyGoal} sessions{sessionsToday >= dailyGoal ? ' ✓' : ''}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--subtext)', marginBottom: 6 }}>Streak</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
            {streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : '0 days'}
          </div>
          <div style={{ fontSize: 11, marginTop: 2, color: streak >= 3 ? '#6dbb7a' : 'var(--subtext)' }}>
            {streak >= 7 ? '🔥 On fire!' : streak >= 3 ? 'Keep going!' : streak > 0 ? 'Building up!' : 'Start today!'}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--subtext)', marginBottom: 6 }}>This week</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{weekStr}</div>
          <div style={{ fontSize: 11, marginTop: 2, color: 'var(--subtext)' }}>Last 7 days</div>
        </div>
      </div>

      {/* Today's tasks header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 10px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Today&apos;s tasks</div>
        <button
          onClick={() => setAddingTask(v => !v)}
          style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--accent-light)', background: 'transparent', color: 'var(--accent-dark)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {addingTask ? '×' : '+'}
        </button>
      </div>

      {/* Add task form */}
      {addingTask && (
        <div style={{ margin: '0 20px 12px', background: '#fff', borderRadius: 'var(--radius-sm)', padding: 14 }}>
          <input
            type="text"
            placeholder="Task name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            autoFocus
            style={{
              width: '100%', border: '1px solid var(--secondary)', borderRadius: 8,
              padding: '8px 10px', fontSize: 14, color: 'var(--text)', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {[5, 10, 15, 25, 30, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => setNewMins(m)}
                style={{
                  padding: '4px 10px', borderRadius: 12, fontSize: 12, cursor: 'pointer',
                  border: '1px solid var(--accent-light)',
                  background: newMins === m ? 'var(--accent)' : 'transparent',
                  color: newMins === m ? '#fff' : 'var(--accent-dark)',
                }}
              >
                {m}m
              </button>
            ))}
          </div>
          <button
            onClick={addTask}
            style={{ marginTop: 10, width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Add task
          </button>
        </div>
      )}

      {/* Task list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--subtext)', fontSize: 13, padding: '20px 0' }}>
            No tasks yet — tap + to add one!
          </div>
        ) : sorted.map(t => (
          <div
            key={t.id}
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: t.status === 'active' ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              opacity: t.status === 'done' ? 0.6 : 1,
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: t.status === 'active' ? 'var(--accent)' : t.status === 'done' ? '#C8E6C9' : 'var(--accent-light)',
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>
                {t.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--subtext)', marginTop: 2 }}>
                {t.status === 'done' ? 'Completed' : t.status === 'active' ? 'In progress' : 'Upcoming'}
                {t.estimatedMinutes ? ` · ${t.estimatedMinutes} min` : ''}
              </div>
            </div>
            {t.status === 'upcoming' && (
              <button
                onClick={() => startTask(t.id)}
                style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
              >
                Start
              </button>
            )}
            {t.status === 'active' && (
              <button
                onClick={() => doneTask(t.id)}
                style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#6dbb7a', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
              >
                Done
              </button>
            )}
            {t.status === 'done' && (
              <span style={{ fontSize: 16, color: '#6dbb7a', flexShrink: 0 }}>✓</span>
            )}
            <button
              onClick={() => removeTask(t.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--subtext)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
