'use client'

import { useState } from 'react'

interface DayRecord {
  date: string
  focusMinutes: number
  sessions: number
}

interface Profile {
  name: string
  dailyGoal: number
}

interface ProfileProps {
  profile: Profile
  history: DayRecord[]
  sessionsToday: number
  focusMinutes: number
  onProfileChange: (p: Profile) => void
}

function fmt(min: number) {
  if (min === 0) return '0m'
  const h = Math.floor(min / 60)
  const m = min % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function ProfileTab({ profile, history, sessionsToday, focusMinutes, onProfileChange }: ProfileProps) {
  const [autoBreak, setAutoBreak] = useState(true)
  const [sound, setSound] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [editingGoal, setEditingGoal] = useState(false)
  const [draftName, setDraftName] = useState(profile.name)
  const [draftGoal, setDraftGoal] = useState(profile.dailyGoal)

  const totalSessions = history.reduce((s, d) => s + d.sessions, 0) + sessionsToday
  const totalMinutes = history.reduce((s, d) => s + d.focusMinutes, 0) + focusMinutes

  const map = new Map(history.map(r => [r.date, r.focusMinutes]))
  if (focusMinutes > 0) map.set(new Date().toDateString(), focusMinutes)
  let streak = 0
  for (let i = 0; i <= 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if ((map.get(d.toDateString()) ?? 0) > 0) streak++
    else break
  }

  const saveName = () => {
    if (draftName.trim()) onProfileChange({ ...profile, name: draftName.trim() })
    setEditingName(false)
  }

  const saveGoal = () => {
    onProfileChange({ ...profile, dailyGoal: draftGoal })
    setEditingGoal(false)
  }

  return (
    <div style={{ padding: '24px 20px 8px' }}>
      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 24px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <svg viewBox="0 0 24 24" fill="var(--accent)" style={{ width: 44, height: 44 }}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
          </svg>
        </div>

        {editingName ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              style={{ fontSize: 18, fontWeight: 700, border: '1px solid var(--accent-light)', borderRadius: 8, padding: '4px 10px', color: 'var(--text)', outline: 'none' }}
            />
            <button onClick={saveName} style={{ fontSize: 13, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>Save</button>
          </div>
        ) : (
          <div
            style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => { setDraftName(profile.name); setEditingName(true) }}
          >
            {profile.name}
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--subtext)" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        )}
        <div style={{ fontSize: 13, color: 'var(--subtext)', marginTop: 2 }}>Focus enthusiast</div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center' }}>
          {[
            { val: totalSessions.toString(), lbl: 'Sessions' },
            { val: null, lbl: '' },
            { val: fmt(totalMinutes), lbl: 'Total' },
            { val: null, lbl: '' },
            { val: streak > 0 ? `${streak}🔥` : '0', lbl: 'Streak' },
          ].map((p, i) =>
            p.val === null
              ? <div key={i} style={{ width: 1, background: 'var(--secondary)', alignSelf: 'stretch' }} />
              : <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{p.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--subtext)' }}>{p.lbl}</div>
                </div>
          )}
        </div>
      </div>

      {/* Timer Settings */}
      <SettingsSection label="Timer settings">
        <SettingRow icon={<ClockIcon />} text="Default focus duration" right={<span style={{ fontSize: 13, color: 'var(--subtext)' }}>25 min</span>} />
        <SettingRow icon={<CupIcon />} text="Auto-start breaks" right={<Toggle on={autoBreak} onClick={() => setAutoBreak(v => !v)} />} />
        <SettingRow icon={<BellIcon />} text="Sound notifications" right={<Toggle on={sound} onClick={() => setSound(v => !v)} />} />
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection label="Preferences">
        <SettingRow
          icon={<TargetIcon />}
          text="Daily focus goal"
          right={
            editingGoal ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setDraftGoal(g => Math.max(1, g - 1))}
                  style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--accent-light)', background: 'transparent', color: 'var(--accent-dark)', cursor: 'pointer', fontSize: 16 }}
                >−</button>
                <span style={{ fontSize: 14, fontWeight: 600, minWidth: 22, textAlign: 'center' }}>{draftGoal}</span>
                <button
                  onClick={() => setDraftGoal(g => Math.min(20, g + 1))}
                  style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--accent-light)', background: 'transparent', color: 'var(--accent-dark)', cursor: 'pointer', fontSize: 16 }}
                >+</button>
                <button
                  onClick={saveGoal}
                  style={{ fontSize: 11, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
                >✓</button>
              </div>
            ) : (
              <span
                style={{ fontSize: 13, color: 'var(--subtext)', cursor: 'pointer' }}
                onClick={() => { setDraftGoal(profile.dailyGoal); setEditingGoal(true) }}
              >
                {profile.dailyGoal} sessions ✎
              </span>
            )
          }
        />
      </SettingsSection>
    </div>
  )
}

function SettingsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--subtext)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, padding: '0 4px' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  )
}

function SettingRow({ icon, text, right }: { icon: React.ReactNode; text: string; right: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{text}</div>
      {right}
    </div>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <div className={`toggle${on ? '' : ' off'}`} onClick={onClick} />
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
}
function CupIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2" style={{ width: 16, height: 16 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
}
function TargetIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
}
