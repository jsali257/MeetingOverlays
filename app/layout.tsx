import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RGV911 Board Overlays',
  description: 'OBS overlays for RGV911 Board of Managers Meetings',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
