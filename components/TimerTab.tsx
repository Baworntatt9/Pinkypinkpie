'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TimerProps {
  onSessionComplete: (minutes: number) => void
}

const MODES = [
  { label: 'Focus', minutes: 25 },
  { label: 'Short break', minutes: 5 },
  { label: 'Long break', minutes: 15 },
]

export default function TimerTab({ onSessionComplete }: TimerProps) {
  const [modeIndex, setModeIndex] = useState(0)
  const [totalSec, setTotalSec] = useState(25 * 60)
  const [remaining, setRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessionsToday, setSessionsToday] = useState(3)
  const [focusMins, setFocusMins] = useState(80)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearTimer()
            setRunning(false)
            if (modeIndex === 0) {
              const earned = Math.round(totalSec / 60)
              setSessionsToday(s => s + 1)
              setFocusMins(m => m + earned)
              onSessionComplete(earned)
            }
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return clearTimer
  }, [running, clearTimer, modeIndex, totalSec, onSessionComplete])

  const setMode = (i: number) => {
    clearTimer()
    setRunning(false)
    setModeIndex(i)
    const secs = MODES[i].minutes * 60
    setTotalSec(secs)
    setRemaining(secs)
  }

  const adjustTime = (delta: number) => {
    if (running) return
    const newMins = Math.max(1, Math.min(90, Math.round(totalSec / 60) + delta))
    setTotalSec(newMins * 60)
    setRemaining(newMins * 60)
  }

  const toggle = () => setRunning(r => !r)

  const reset = () => {
    clearTimer()
    setRunning(false)
    setRemaining(totalSec)
  }

  const skip = () => {
    clearTimer()
    setRunning(false)
    setRemaining(0)
  }

  const m = String(Math.floor(remaining / 60)).padStart(2, '0')
  const s = String(remaining % 60).padStart(2, '0')
  const pct = remaining / totalSec
  const circumference = 628
  const offset = circumference * (1 - pct)
  const hours = Math.floor(focusMins / 60)
  const mins = focusMins % 60
  const focusStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <div style={{ padding: '24px 20px 8px' }}>
      {/* Mode Tabs */}
      <div className="mode-tabs" style={{ marginBottom: 28 }}>
        {MODES.map((mode, i) => (
          <button key={i} className={`mode-tab${modeIndex === i ? ' active' : ''}`} onClick={() => setMode(i)}>
            {mode.label}
          </button>
        ))}
      </div>

      {/* Focus Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--secondary)', borderRadius: 20, padding: '6px 14px', color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
          {MODES[modeIndex].label} mode
        </div>
      </div>

      {/* Ring Timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="110" cy="110" r="100" fill="none" stroke="var(--secondary)" strokeWidth="8" />
            <circle
              className="ring-progress"
              cx="110" cy="110" r="100"
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: 'var(--text)', lineHeight: 1, letterSpacing: -2 }}>{m}:{s}</div>
            <div style={{ fontSize: 13, color: 'var(--subtext)', marginTop: 6, fontWeight: 500 }}>
              {running ? `${MODES[modeIndex].label} time!` : remaining === 0 ? 'Session complete!' : 'Ready to focus'}
            </div>
          </div>
        </div>
      </div>

      {/* Adjust */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
        <button onClick={() => adjustTime(-5)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--accent-light)', background: 'transparent', color: 'var(--accent-dark)', fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ fontSize: 13, color: 'var(--subtext)', fontWeight: 500, minWidth: 60, textAlign: 'center' }}>{Math.round(totalSec / 60)} min</span>
        <button onClick={() => adjustTime(+5)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--accent-light)', background: 'transparent', color: 'var(--accent-dark)', fontSize: 18, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <button onClick={reset} style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--secondary)', background: '#fff', color: 'var(--subtext)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
          </svg>
        </button>
        <button onClick={toggle} style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {running
            ? <svg viewBox="0 0 24 24" fill="white" style={{ width: 26, height: 26 }}><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            : <svg viewBox="0 0 24 24" fill="white" style={{ width: 26, height: 26 }}><polygon points="5,3 19,12 5,21" /></svg>
          }
        </button>
        <button onClick={skip} style={{ width: 48, height: 48, borderRadius: '50%', border: '1.5px solid var(--secondary)', background: '#fff', color: 'var(--subtext)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
            <polygon points="5,4 15,12 5,20" /><line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* Session Info */}
      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {[
          { val: sessionsToday, lbl: 'Sessions today' },
          { val: focusStr, lbl: 'Total focus' },
          { val: 4, lbl: 'Daily goal' },
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 'var(--radius-sm)', padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{c.val}</div>
            <div style={{ fontSize: 11, color: 'var(--subtext)', marginTop: 2 }}>{c.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
