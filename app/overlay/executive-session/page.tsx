'use client'
import { useEffect, useState } from 'react'

const LOGO = 'https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png'

interface Meeting {
  title: string
  date: string
  execSessionImageUrl?: string
}

export default function ExecutiveSessionOverlay() {
  const [meeting, setMeeting] = useState<Meeting | null>(null)

  useEffect(() => {
    fetch('/api/meeting/current')
      .then(r => r.json())
      .then(d => d && setMeeting(d))
      .catch(() => {})
  }, [])

  // If a custom image URL is set, display it full screen
  if (meeting?.execSessionImageUrl) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meeting.execSessionImageUrl}
          alt="Executive Session"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  // Default styled executive session
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
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Animated diagonal shimmer lines */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '30px',
            height: '200%',
            backgroundColor: 'rgba(255,188,15,0.06)',
            transform: `rotate(30deg) translateX(${i * 220}px)`,
            animation: `shimmer 4s ease-in-out ${i * 1.2}s infinite`,
          }}
        />
      ))}

      {/* Top orange bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: '#ffbc0f' }} />
      {/* Bottom orange bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', backgroundColor: '#ffbc0f' }} />

      {/* Corner accents */}
      {([
        { pos: { top: '24px',    left:  '32px' }, t: true,  b: false, l: true,  r: false },
        { pos: { top: '24px',    right: '32px' }, t: true,  b: false, l: false, r: true  },
        { pos: { bottom: '24px', left:  '32px' }, t: false, b: true,  l: true,  r: false },
        { pos: { bottom: '24px', right: '32px' }, t: false, b: true,  l: false, r: true  },
      ] as const).map(({ pos, t, b, l, r }, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '50px',
            height: '50px',
            ...pos,
            borderTopWidth:    t ? '3px' : 0,
            borderBottomWidth: b ? '3px' : 0,
            borderLeftWidth:   l ? '3px' : 0,
            borderRightWidth:  r ? '3px' : 0,
            borderStyle: 'solid',
            borderColor: 'rgba(255,188,15,0.5)',
          }}
        />
      ))}

      {/* Logo top */}
      <div style={{ position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="RGV911" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
      </div>

      {/* LIVE badge */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '56px',
          backgroundColor: '#ffbc0f',
          color: '#0c3877',
          padding: '4px 14px',
          fontSize: '13px',
          fontWeight: '900',
          letterSpacing: '3px',
          animation: 'livePulse 1.4s ease-in-out infinite',
        }}
      >
        LIVE
      </div>

      {/* Center content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Meeting title small */}
        <div
          style={{
            color: '#8ea6c8',
            fontSize: 'clamp(11px, 1.2vw, 16px)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '28px',
            fontWeight: '700',
          }}
        >
          {meeting?.title ?? 'RGV911 Board of Managers Meeting'}
        </div>

        {/* EXECUTIVE banner */}
        <div
          style={{
            backgroundColor: '#ffbc0f',
            padding: '10px 32px',
            marginBottom: '6px',
            display: 'inline-block',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(36px, 7vw, 100px)',
              fontWeight: '900',
              color: '#0c3877',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              fontFamily: 'Arial Black, Arial, sans-serif',
              lineHeight: 1,
            }}
          >
            EXECUTIVE
          </span>
        </div>

        {/* SESSION box */}
        <div
          style={{
            border: '4px solid #ffbc0f',
            padding: '10px 32px',
            display: 'inline-block',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(30px, 6vw, 84px)',
              fontWeight: '900',
              color: '#FFFFFF',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              fontFamily: 'Arial Black, Arial, sans-serif',
              lineHeight: 1,
            }}
          >
            SESSION
          </span>
        </div>

        {/* Date */}
        <div
          style={{
            color: '#ffbc0f',
            fontSize: 'clamp(12px, 1.4vw, 18px)',
            letterSpacing: '4px',
            marginTop: '28px',
          }}
        >
          {meeting?.date ?? 'July 17, 2026'}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
