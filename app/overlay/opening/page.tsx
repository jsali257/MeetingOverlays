'use client'
import { useEffect, useState } from 'react'

interface Meeting {
  title: string
  date: string
}

export default function OpeningOverlay() {
  const [meeting, setMeeting] = useState<Meeting | null>(null)

  useEffect(() => {
    fetch('/api/meeting/current')
      .then(r => r.json())
      .then(d => d && setMeeting(d))
      .catch(() => {})
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0c3877',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: '#0a2e6b',
          padding: '18px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '4px solid #ffbc0f',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png"
          alt="RGV911"
          style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
        />
        <div style={{ color: '#8ea6c8', fontSize: '14px', letterSpacing: '2px' }}>
          {meeting?.date ?? 'July 17, 2026'}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
        }}
      >
        {/* Live badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(0,210,106,0.1)',
            border: '1px solid rgba(0,210,106,0.5)',
            borderRadius: '24px',
            padding: '8px 22px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#00d26a',
            }}
          />
          <span
            style={{
              color: '#00d26a',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '3px',
            }}
          >
            MEETING IN SESSION
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 'clamp(20px, 3.2vw, 46px)',
            fontWeight: '900',
            color: '#FFFFFF',
            textAlign: 'center',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: 'Arial Black, Arial, sans-serif',
            lineHeight: 1.2,
            maxWidth: '80%',
          }}
        >
          {meeting?.title ?? 'Board of Managers Meeting'}
        </div>

        {/* Divider */}
        <div style={{ width: '100px', height: '3px', backgroundColor: '#ffbc0f' }} />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 'clamp(13px, 1.6vw, 20px)',
            fontWeight: '400',
            color: '#8ea6c8',
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Meeting Called to Order
        </div>
      </div>

      {/* Footer bar */}
      <div
        style={{
          backgroundColor: '#0a2e6b',
          padding: '14px 48px',
          borderTop: '4px solid #ffbc0f',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#ffbc0f',
            fontSize: '12px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontWeight: '700',
          }}
        >
          RGV911 Board of Managers
        </div>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #00d26a; }
          50% { opacity: 0.5; box-shadow: 0 0 2px #00d26a; }
        }
      `}</style>
    </div>
  )
}
