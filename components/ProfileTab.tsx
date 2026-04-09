'use client'

import { useState } from 'react'

export default function ProfileTab() {
  const [autoBreak, setAutoBreak] = useState(true)
  const [sound, setSound] = useState(true)
  const [blockApps, setBlockApps] = useState(false)

  return (
    <div style={{ padding: '24px 20px 8px' }}>
      {/* Hero */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 24px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 40, lineHeight: 1 }}>🐷</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Pinky User</div>
        <div style={{ fontSize: 13, color: 'var(--subtext)', marginTop: 2 }}>Focus enthusiast · Joined Jan 2025</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center' }}>
          {[
            { val: '127', lbl: 'Sessions' },
            { val: null, lbl: '' },
            { val: '52h', lbl: 'Total' },
            { val: null, lbl: '' },
            { val: '7🔥', lbl: 'Streak' },
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
        <SettingRow icon={<TargetIcon />} text="Daily focus goal" right={<span style={{ fontSize: 13, color: 'var(--subtext)' }}>4 sessions</span>} />
        <SettingRow icon={<LockIcon />} text="Block distracting apps" right={<Toggle on={blockApps} onClick={() => setBlockApps(v => !v)} />} />
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
    <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
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
function LockIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-dark)" strokeWidth="2" style={{ width: 16, height: 16 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
}
