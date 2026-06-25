'use client'
import { useEffect, useRef, useState } from 'react'

const LOGO = 'https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png'

interface AgendaItem {
  id: string
  text: string
  isActive: boolean
  isCompleted: boolean
}

interface Meeting {
  title: string
  date: string
  agendaItems: AgendaItem[]
}

export default function AgendaOverlay() {
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [visible, setVisible] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const poll = () => {
      fetch('/api/meeting/current')
        .then(r => r.json())
        .then(d => {
          setMeeting(d)
          if (d) setTimeout(() => setVisible(true), 120)
        })
        .catch(() => {})
    }
    poll()
    intervalRef.current = setInterval(poll, 500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  if (!meeting) {
    return <div style={{ width: '100vw', height: '100vh', background: 'transparent' }} />
  }

  const activeItem = meeting.agendaItems.find(i => i.isActive)
  const activeIndex = meeting.agendaItems.findIndex(i => i.isActive)
  const displayText = activeItem ? activeItem.text : meeting.title

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Lower-third container */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Main agenda bar */}
        <div
          style={{
            backgroundColor: 'rgba(12, 56, 119, 0.97)',
            borderTop: '5px solid #ffbc0f',
            padding: '14px 48px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* AGENDA badge */}
          <div
            style={{
              backgroundColor: '#ffbc0f',
              color: '#0c3877',
              padding: '5px 16px',
              fontSize: '12px',
              fontWeight: '900',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {activeItem ? 'AGENDA' : 'MEETING'}
          </div>

          {/* Item text */}
          <div
            style={{
              fontSize: 'clamp(18px, 2.2vw, 28px)',
              fontWeight: '700',
              color: '#FFFFFF',
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'all 0.3s ease',
            }}
          >
            {displayText}
          </div>

          {/* Item counter */}
          {activeItem && meeting.agendaItems.length > 0 && (
            <div
              style={{
                fontSize: '13px',
                color: '#ffbc0f',
                letterSpacing: '2px',
                flexShrink: 0,
                fontWeight: '700',
              }}
            >
              ITEM {activeIndex + 1} / {meeting.agendaItems.length}
            </div>
          )}
        </div>

        {/* Info bar */}
        <div
          style={{
            backgroundColor: 'rgba(6, 27, 69, 0.97)',
            padding: '9px 48px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            alt="RGV911"
            style={{ height: '22px', width: 'auto', objectFit: 'contain' }}
          />
          <div style={{ width: '1px', height: '18px', backgroundColor: '#1a58c8', flexShrink: 0 }} />
          <div style={{ color: '#8ea6c8', fontSize: '13px', letterSpacing: '0.5px' }}>
            {meeting.title}
            {meeting.date ? ` • ${meeting.date}` : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
