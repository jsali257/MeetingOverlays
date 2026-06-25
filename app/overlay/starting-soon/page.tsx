'use client'
import { useEffect, useState } from 'react'

interface Meeting {
  title: string
  date: string
}

export default function StartingSoonOverlay() {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    fetch('/api/meeting/current')
      .then(r => r.json())
      .then(d => d && setMeeting(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
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
      }}
    >
      {/* ── Animated scan shimmer ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(255,188,15,0.04), transparent)',
          animation: 'scan 5s linear infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Top orange bar ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: '#ffbc0f',
          zIndex: 2,
        }}
      />

      {/* ── Bottom orange bar + cycling progress ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        {/* Cycling progress bar */}
        <div style={{ height: '4px', backgroundColor: '#0a2e6b', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#ffbc0f',
              animation: 'progressCycle 3.5s ease-in-out infinite',
              transformOrigin: 'left',
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: '#0a2e6b',
            padding: '14px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
          <div style={{ color: '#4a6080', fontSize: '12px', letterSpacing: '2px' }}>
            {meeting?.date ?? 'July 17, 2026'}
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '22px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png"
          alt="RGV911"
          style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
        />
        <div
          style={{
            color: '#8ea6c8',
            fontSize: '22px',
            letterSpacing: '3px',
            fontWeight: '300',
          }}
        >
          {time}
        </div>
      </div>

      {/* ── Corner accents ── */}
      {([
        { pos: { top: '70px',    left:  '30px' }, t: true,  b: false, l: true,  r: false },
        { pos: { top: '70px',    right: '30px' }, t: true,  b: false, l: false, r: true  },
        { pos: { bottom: '80px', left:  '30px' }, t: false, b: true,  l: true,  r: false },
        { pos: { bottom: '80px', right: '30px' }, t: false, b: true,  l: false, r: true  },
      ] as const).map(({ pos, t, b, l, r }, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '44px',
            height: '44px',
            ...pos,
            borderTopWidth:    t ? '3px' : 0,
            borderBottomWidth: b ? '3px' : 0,
            borderLeftWidth:   l ? '3px' : 0,
            borderRightWidth:  r ? '3px' : 0,
            borderStyle: 'solid',
            borderColor: 'rgba(255,188,15,0.35)',
            zIndex: 1,
          }}
        />
      ))}

      {/* ── Center content ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -52%)',
          textAlign: 'center',
          width: '78%',
          zIndex: 1,
        }}
      >
        {/* Welcome label */}
        <div
          style={{
            color: '#4a6080',
            fontSize: '13px',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom: '22px',
            fontWeight: '700',
          }}
        >
          Welcome to
        </div>

        {/* Meeting title */}
        <div
          style={{
            fontSize: 'clamp(22px, 3.6vw, 50px)',
            fontWeight: '900',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            lineHeight: 1.18,
            fontFamily: 'Arial Black, Arial, sans-serif',
            marginBottom: '30px',
          }}
        >
          {meeting?.title ?? 'Board of Managers Meeting'}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '90px',
            height: '3px',
            backgroundColor: '#ffbc0f',
            margin: '0 auto 30px',
          }}
        />

        {/* Starting Soon row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#ffbc0f',
              animation: 'pulseDot 1.4s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 'clamp(15px, 1.9vw, 26px)',
              fontWeight: '700',
              color: '#ffbc0f',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Meeting Starting Soon
          </span>
          <div
            style={{
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              backgroundColor: '#ffbc0f',
              animation: 'pulseDot 1.4s ease-in-out infinite 0.7s',
              flexShrink: 0,
            }}
          />
        </div>

        {/* Date */}
        <div
          style={{
            color: '#ffbc0f',
            fontSize: 'clamp(12px, 1.5vw, 19px)',
            letterSpacing: '4px',
          }}
        >
          {meeting?.date ?? 'July 17, 2026'}
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(0.65); }
        }
        @keyframes scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes progressCycle {
          0%   { width: 0%;   opacity: 1; }
          85%  { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
