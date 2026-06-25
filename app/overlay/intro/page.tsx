'use client'
import { useEffect, useState } from 'react'

interface Meeting {
  title: string
  date: string
}

export default function IntroOverlay() {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    fetch('/api/meeting/current')
      .then(r => r.json())
      .then(d => d && setMeeting(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 700),
      setTimeout(() => setStep(3), 1050),
      setTimeout(() => setStep(4), 1400),
      setTimeout(() => setStep(5), 1850),
      setTimeout(() => setStep(6), 2250),
      setTimeout(() => setStep(7), 2650),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const tr = 'opacity 0.6s ease, transform 0.6s ease'

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
      {/* Top orange bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: '#ffbc0f',
          opacity: step >= 1 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Bottom orange bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          backgroundColor: '#ffbc0f',
          opacity: step >= 1 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Top-right logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png"
        alt="RGV911"
        style={{
          position: 'absolute',
          top: '20px',
          right: '48px',
          height: '42px',
          width: 'auto',
          objectFit: 'contain',
          opacity: step >= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Left accent line */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: step >= 2 ? '40%' : '0%',
          backgroundColor: '#ffbc0f',
          transition: 'height 0.6s ease',
        }}
      />

      {/* Main content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png"
            alt="RGV911"
            style={{
              height: 'clamp(100px, 16vw, 200px)',
              width: 'auto',
              objectFit: 'contain',
              opacity: step >= 2 ? 1 : 0,
              transform: step >= 2 ? 'scale(1)' : 'scale(0.75)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          />
        </div>

        {/* WELCOME banner */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: step >= 3 ? '#ffbc0f' : 'transparent',
            padding: step >= 3 ? '6px 28px' : '6px 0',
            marginBottom: '10px',
            opacity: step >= 3 ? 1 : 0,
            transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease, background-color 0.3s ease, padding 0.3s ease',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(26px, 4.5vw, 60px)',
              fontWeight: '900',
              color: '#0c3877',
              letterSpacing: '8px',
              textTransform: 'uppercase',
              fontFamily: 'Arial Black, Arial, sans-serif',
            }}
          >
            WELCOME
          </span>
        </div>

        {/* Divider */}
        <div style={{ margin: '12px auto', width: '55%', overflow: 'hidden' }}>
          <div
            style={{
              height: '3px',
              backgroundColor: '#ffbc0f',
              transform: step >= 4 ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
              transition: 'transform 0.6s ease',
            }}
          />
        </div>

        {/* Meeting title */}
        <div
          style={{
            fontSize: 'clamp(16px, 2.4vw, 30px)',
            fontWeight: '700',
            color: '#FFFFFF',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom: '14px',
            opacity: step >= 5 ? 1 : 0,
            transform: step >= 5 ? 'translateY(0)' : 'translateY(30px)',
            transition: tr,
          }}
        >
          {meeting?.title ?? 'Board of Managers Meeting'}
        </div>

        {/* Date */}
        <div
          style={{
            fontSize: 'clamp(13px, 1.7vw, 22px)',
            fontWeight: '400',
            color: '#ffbc0f',
            letterSpacing: '4px',
            opacity: step >= 6 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          {meeting?.date ?? 'July 17, 2026'}
        </div>
      </div>

      {/* Bottom dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          opacity: step >= 7 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: i === 2 ? '#ffbc0f' : '#1a58c8',
            }}
          />
        ))}
      </div>
    </div>
  )
}
