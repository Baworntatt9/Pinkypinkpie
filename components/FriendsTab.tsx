'use client'

import { useState } from 'react'

type Period = 'today' | 'week' | 'month'

interface Friend {
  name: string
  avatar: string
  focusToday: number
  focusWeek: number
  focusMonth: number
  sessionsToday: number
  streak: number
  isMe?: boolean
}

const FRIENDS: Friend[] = [
  { name: 'You',  avatar: '🐷', focusToday: 80,  focusWeek: 520, focusMonth: 2100, sessionsToday: 3, streak: 7,  isMe: true },
  { name: 'Mint', avatar: '🌿', focusToday: 110, focusWeek: 680, focusMonth: 2480, sessionsToday: 4, streak: 12 },
  { name: 'Lumi', avatar: '🌙', focusToday: 130, focusWeek: 760, focusMonth: 2900, sessionsToday: 5, streak: 21 },
  { name: 'Wave', avatar: '🌊', focusToday: 75,  focusWeek: 410, focusMonth: 1750, sessionsToday: 3, streak: 5  },
  { name: 'Nemo', avatar: '🐠', focusToday: 50,  focusWeek: 290, focusMonth: 980,  sessionsToday: 2, streak: 2  },
  { name: 'Koko', avatar: '🐨', focusToday: 40,  focusWeek: 180, focusMonth: 720,  sessionsToday: 1, streak: 1  },
]

function fmt(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const medalEmoji = ['🥇', '🥈', '🥉']

export default function FriendsTab({
  myFocusMinutes,
  mySessionsToday,
}: {
  myFocusMinutes: number
  mySessionsToday: number
}) {
  const [period, setPeriod] = useState<Period>('today')

  const focusKey = period === 'today' ? 'focusToday' : period === 'week' ? 'focusWeek' : 'focusMonth'

  const ranked = [...FRIENDS]
    .map(f => f.isMe ? { ...f, focusToday: myFocusMinutes, sessionsToday: mySessionsToday } : f)
    .sort((a, b) => b[focusKey] - a[focusKey])

  const me = ranked.find(f => f.isMe)!
  const myRank = ranked.indexOf(me) + 1
  const leader = ranked[0]
  const maxFocus = leader[focusKey]
  const myFocus = focusKey === 'focusToday' ? myFocusMinutes : me[focusKey]

  return (
    <div style={{ paddingBottom: 0}}>
      {/* Header */}
      <div style={{
        padding: '28px 24px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', fontStyle: 'italic' }}>
          Friends
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--subtext)" strokeWidth="2" style={{ width: 18, height: 18 }}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      </div>

      {/* Rank banner — same style as greeting card */}
      <div style={{
        margin: '0 20px 20px',
        background: 'var(--accent)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, flexShrink: 0,
        }}>
          {me.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
            You&apos;re #{myRank} this {period}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
            {myRank === 1
              ? 'Leading the pack 🎉'
              : `${fmt(maxFocus - myFocus)} behind ${leader.name}`}
          </p>
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
          {myRank <= 3 ? medalEmoji[myRank - 1] : `#${myRank}`}
        </div>
      </div>

      {/* Period tabs */}
      <div style={{ padding: '0 20px 16px' }}>
        <div className="mode-tabs">
          {(['today', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              className={`mode-tab${period === p ? ' active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ranked.map((f, i) => {
          const val = focusKey === 'focusToday' && f.isMe ? myFocusMinutes : f[focusKey]
          const sessions = focusKey === 'focusToday' && f.isMe ? mySessionsToday : f.sessionsToday
          const barPct = maxFocus > 0 ? (val / maxFocus) * 100 : 0

          return (
            <div
              key={f.name}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                border: f.isMe ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Rank */}
                <div style={{
                  width: 24, textAlign: 'center', flexShrink: 0,
                  fontSize: i < 3 ? 18 : 13,
                  fontWeight: 700,
                  color: i < 3 ? ['#F5C842', '#A8A8A8', '#C4845A'][i] : 'var(--subtext)',
                }}>
                  {i < 3 ? medalEmoji[i] : `#${i + 1}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: f.isMe ? 'var(--accent-light)' : 'var(--secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {f.avatar}
                </div>

                {/* Name + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{
                      fontSize: 14, fontWeight: f.isMe ? 700 : 500,
                      color: f.isMe ? 'var(--accent-dark)' : 'var(--text)',
                    }}>
                      {f.isMe ? 'You' : f.name}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--subtext)' }}>🔥{f.streak}</span>
                  </div>
                  <div style={{
                    height: 5, borderRadius: 3,
                    background: 'var(--secondary)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: `${barPct}%`,
                      background: f.isMe ? 'var(--accent)' : 'var(--accent-light)',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>

                {/* Focus + sessions */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: f.isMe ? 'var(--accent-dark)' : 'var(--text)',
                  }}>
                    {fmt(val)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--subtext)', marginTop: 1 }}>
                    {sessions} sessions
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* You vs Leader */}
      {myRank > 1 && (
        <div style={{
          margin: '16px 20px 0',
          background: '#fff',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600,
            color: 'var(--subtext)',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            marginBottom: 12,
          }}>
            You vs {leader.name}
          </div>

          {/* You row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 16, width: 28, textAlign: 'center' }}>{me.avatar}</div>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--secondary)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${(myFocus / maxFocus) * 100}%`,
                background: 'var(--accent)',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', width: 48, textAlign: 'right' }}>
              {fmt(myFocus)}
            </div>
          </div>

          {/* Leader row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 16, width: 28, textAlign: 'center' }}>{leader.avatar}</div>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--secondary)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, width: '100%', background: '#F5C842' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', width: 48, textAlign: 'right' }}>
              {fmt(maxFocus)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
