import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PinkyPie Focus',
  description: 'Your personal focus timer and productivity tracker',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%' }}>{children}</body>
    </html>
  )
}
