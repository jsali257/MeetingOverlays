export default function Home() {
  const overlays = [
    {
      label: 'Starting Soon',
      path: '/overlay/starting-soon',
      note: 'Full screen (1920×1080) — pre-meeting screen with live clock and cycling progress bar',
    },
    {
      label: 'Intro',
      path: '/overlay/intro',
      note: 'Full screen (1920×1080) — animated intro sequence',
    },
    {
      label: 'Opening',
      path: '/overlay/opening',
      note: 'Full screen (1920×1080) — meeting in session screen',
    },
    {
      label: 'Agenda',
      path: '/overlay/agenda',
      note: 'Transparent lower-third bar at bottom. Enable transparent background in OBS.',
    },
    {
      label: 'Executive Session',
      path: '/overlay/executive-session',
      note: 'Full screen — shows your custom image URL (set in Control Panel) or default styled page.',
    },
  ]

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#0c3877',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png"
            alt="RGV911"
            style={{ height: '70px', width: 'auto', objectFit: 'contain', marginBottom: '6px' }}
          />
          <p style={{ color: '#8ea6c8', margin: '0 0 16px', fontSize: '15px', letterSpacing: '1px' }}>
            Board Meeting Overlay System
          </p>
          <div style={{ height: '3px', backgroundColor: '#ffbc0f', width: '60px' }} />
        </div>

        {/* Control Panel link */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              color: '#ffbc0f',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
              fontWeight: '700',
            }}
          >
            Control Panel
          </div>
          <a
            href="/control"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffbc0f',
              color: 'white',
              padding: '13px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '15px',
            }}
          >
            Open Control Panel →
          </a>
          <p style={{ color: '#4a6080', fontSize: '13px', marginTop: '10px' }}>
            Use on your phone during the meeting to control overlays in real time.
          </p>
        </div>

        {/* OBS Browser Source URLs */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              color: '#ffbc0f',
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '14px',
              fontWeight: '700',
            }}
          >
            OBS Browser Source URLs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {overlays.map(({ label, path, note }) => (
              <div
                key={path}
                style={{
                  backgroundColor: '#0a2e6b',
                  borderRadius: '10px',
                  padding: '18px 20px',
                  borderLeft: '4px solid #ffbc0f',
                }}
              >
                <div style={{ fontWeight: '700', marginBottom: '8px', fontSize: '15px' }}>{label}</div>
                <code
                  style={{
                    display: 'block',
                    backgroundColor: '#061b45',
                    padding: '9px 14px',
                    borderRadius: '6px',
                    color: '#ffbc0f',
                    fontSize: '13px',
                    marginBottom: '8px',
                    wordBreak: 'break-all',
                  }}
                >
                  https://YOUR-APP.vercel.app{path}
                </code>
                <div style={{ color: '#8ea6c8', fontSize: '13px' }}>{note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OBS Agenda transparency note */}
        <div
          style={{
            backgroundColor: '#1a2f5e',
            borderRadius: '10px',
            padding: '18px 20px',
            border: '1px solid rgba(255,140,0,0.4)',
          }}
        >
          <div style={{ color: '#ffbc0f', fontWeight: '700', marginBottom: '8px' }}>
            Agenda Overlay — OBS Setup
          </div>
          <p style={{ color: '#cdd9e8', fontSize: '13px', margin: '0 0 10px', lineHeight: '1.6' }}>
            In OBS, add the Agenda URL as a Browser Source, then in the{' '}
            <strong>Custom CSS</strong> field paste:
          </p>
          <code
            style={{
              display: 'block',
              backgroundColor: '#061b45',
              padding: '9px 14px',
              borderRadius: '6px',
              color: '#ffbc0f',
              fontSize: '13px',
            }}
          >
            {'body { background-color: rgba(0,0,0,0) !important; }'}
          </code>
          <p style={{ color: '#4a6080', fontSize: '12px', margin: '10px 0 0' }}>
            This makes the area outside the agenda panel fully transparent.
          </p>
        </div>
      </div>
    </main>
  )
}
