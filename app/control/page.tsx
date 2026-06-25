'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

interface AgendaItem {
  id: string
  text: string
  isActive: boolean
  isCompleted: boolean
}

interface Meeting {
  _id: string
  title: string
  date: string
  organization: string
  agendaItems: AgendaItem[]
  isActive: boolean
  createdAt: string
}

type View = 'list' | 'detail' | 'create'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const S = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#061b45',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    paddingBottom: '40px',
  } as React.CSSProperties,
  header: {
    backgroundColor: '#0c3877',
    padding: '16px 20px',
    borderBottom: '3px solid #ffbc0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  } as React.CSSProperties,
  card: {
    backgroundColor: '#0a2e6b',
    borderRadius: '10px',
    margin: '0 16px 10px',
    padding: '16px',
    border: '1px solid #1a58c8',
  } as React.CSSProperties,
  input: {
    backgroundColor: '#0c3877',
    border: '1px solid #1a58c8',
    borderRadius: '7px',
    padding: '11px 14px',
    color: 'white',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'Arial, sans-serif',
    outline: 'none',
  } as React.CSSProperties,
  label: {
    display: 'block',
    color: '#8ea6c8',
    fontSize: '11px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    marginBottom: '7px',
    fontWeight: '700',
  } as React.CSSProperties,
}

function btn(
  bg: string,
  color = '#fff',
  extra?: React.CSSProperties
): React.CSSProperties {
  return {
    backgroundColor: bg,
    color,
    border: 'none',
    borderRadius: '7px',
    padding: '9px 15px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    ...extra,
  }
}

export default function ControlPanel() {
  const [view, setView] = useState<View>('list')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selected, setSelected] = useState<Meeting | null>(null)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('July 17, 2026')
  const [newItemText, setNewItemText] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const fetchMeetings = useCallback(async () => {
    const res = await fetch('/api/meeting')
    setMeetings(await res.json())
  }, [])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  const patch = useCallback(async (id: string, body: object) => {
    await fetch(`/api/meeting/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }, [])

  const createMeeting = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const res = await fetch('/api/meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        date: newDate.trim() || 'July 17, 2026',
        organization: 'RGV911',
        agendaItems: [],
        isActive: false,
      }),
    })
    const meeting: Meeting = await res.json()
    setCreating(false)
    setNewTitle('')
    setNewDate('July 17, 2026')
    await fetchMeetings()
    setSelected(meeting)
    setView('detail')
  }

  const deleteMeeting = async () => {
    if (!selected) return
    if (!confirm('Delete this meeting permanently?')) return
    await fetch(`/api/meeting/${selected._id}`, { method: 'DELETE' })
    await fetchMeetings()
    setSelected(null)
    setView('list')
  }

  const toggleLive = async () => {
    if (!selected) return
    const next = !selected.isActive
    const updated = { ...selected, isActive: next }
    setSelected(updated)
    await patch(selected._id, { isActive: next })
    await fetchMeetings()
  }

  const setActiveItem = async (itemId: string) => {
    if (!selected) return
    const updatedItems = selected.agendaItems.map(item => ({
      ...item,
      isActive: item.id === itemId ? !item.isActive : false,
    }))
    const updated = { ...selected, agendaItems: updatedItems }
    setSelected(updated)
    await patch(selected._id, { agendaItems: updatedItems })
  }

  const toggleComplete = async (itemId: string) => {
    if (!selected) return
    const updatedItems = selected.agendaItems.map(item =>
      item.id === itemId
        ? { ...item, isCompleted: !item.isCompleted, isActive: item.isCompleted ? item.isActive : false }
        : item
    )
    const updated = { ...selected, agendaItems: updatedItems }
    setSelected(updated)
    await patch(selected._id, { agendaItems: updatedItems })
  }

  const deleteItem = async (itemId: string) => {
    if (!selected) return
    const updatedItems = selected.agendaItems.filter(item => item.id !== itemId)
    const updated = { ...selected, agendaItems: updatedItems }
    setSelected(updated)
    await patch(selected._id, { agendaItems: updatedItems })
  }

  const addItem = async () => {
    if (!selected || !newItemText.trim()) return
    const item: AgendaItem = {
      id: uid(),
      text: newItemText.trim(),
      isActive: false,
      isCompleted: false,
    }
    const updatedItems = [...selected.agendaItems, item]
    const updated = { ...selected, agendaItems: updatedItems }
    setSelected(updated)
    setNewItemText('')
    await patch(selected._id, { agendaItems: updatedItems })
  }

  const updateTitle = (title: string) => {
    if (!selected) return
    const id = selected._id
    setSelected(prev => prev ? { ...prev, title } : prev)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => patch(id, { title }), 900)
  }

  const updateDate = (date: string) => {
    if (!selected) return
    const id = selected._id
    setSelected(prev => prev ? { ...prev, date } : prev)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => patch(id, { date }), 900)
  }

  const updateExecSessionUrl = (execSessionImageUrl: string) => {
    if (!selected) return
    const id = selected._id
    setSelected(prev => prev ? { ...prev, execSessionImageUrl } : prev)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => patch(id, { execSessionImageUrl }), 900)
  }

  // ─── LIST VIEW ────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dql3efszd/image/upload/v1736874273/RGV911-Logo_pqibpo.png"
              alt="RGV911"
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
            />
            <span style={{ color: '#8ea6c8', fontSize: '13px' }}>Control</span>
          </div>
          <button style={btn('#ffbc0f')} onClick={() => setView('create')}>
            + New Meeting
          </button>
        </div>

        <div style={{ paddingTop: '12px' }}>
          {meetings.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#4a6080', padding: '60px 20px', fontSize: '15px' }}>
              No meetings yet.
              <br />
              <span style={{ color: '#8ea6c8' }}>Tap + New Meeting to get started.</span>
            </div>
          ) : (
            meetings.map(m => (
              <div
                key={m._id}
                style={{
                  ...S.card,
                  cursor: 'pointer',
                  borderLeft: m.isActive ? '4px solid #00d26a' : '4px solid #1a58c8',
                }}
                onClick={() => { setSelected(m); setView('detail') }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', flex: 1, lineHeight: 1.3 }}>{m.title}</div>
                  {m.isActive && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      backgroundColor: 'rgba(0,210,106,0.12)',
                      border: '1px solid rgba(0,210,106,0.5)',
                      borderRadius: '12px', padding: '3px 10px', flexShrink: 0,
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00d26a' }} />
                      <span style={{ color: '#00d26a', fontSize: '11px', fontWeight: '700' }}>LIVE</span>
                    </div>
                  )}
                </div>
                <div style={{ color: '#8ea6c8', fontSize: '13px', marginTop: '6px' }}>{m.date}</div>
                <div style={{ color: '#4a6080', fontSize: '12px', marginTop: '4px' }}>
                  {m.agendaItems.length} agenda item{m.agendaItems.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // ─── CREATE VIEW ──────────────────────────────────────────────────────────
  if (view === 'create') {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <button
            style={{ background: 'none', border: 'none', color: '#ffbc0f', cursor: 'pointer', fontSize: '16px', padding: 0, fontFamily: 'Arial, sans-serif' }}
            onClick={() => setView('list')}
          >
            ← Back
          </button>
          <span style={{ fontWeight: '700' }}>New Meeting</span>
          <div style={{ width: '48px' }} />
        </div>

        <div style={{ padding: '20px 16px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={S.label}>Meeting Title</label>
            <input
              style={S.input}
              placeholder="e.g. RGV911 Board of Managers Meeting"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createMeeting()}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={S.label}>Date</label>
            <input
              style={S.input}
              placeholder="e.g. July 17, 2026"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createMeeting()}
            />
          </div>
          <button
            style={{
              ...btn('#ffbc0f', '#fff', { width: '100%', padding: '14px', fontSize: '16px' }),
              opacity: !newTitle.trim() || creating ? 0.6 : 1,
            }}
            onClick={createMeeting}
            disabled={creating || !newTitle.trim()}
          >
            {creating ? 'Creating…' : 'Create Meeting →'}
          </button>
        </div>
      </div>
    )
  }

  // ─── DETAIL VIEW ──────────────────────────────────────────────────────────
  if (view === 'detail' && selected) {
    return (
      <div style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <button
            style={{ background: 'none', border: 'none', color: '#ffbc0f', cursor: 'pointer', fontSize: '16px', padding: 0, fontFamily: 'Arial, sans-serif' }}
            onClick={async () => { await fetchMeetings(); setView('list') }}
          >
            ← Back
          </button>
          <span style={{ fontWeight: '700', fontSize: '14px' }}>Manage Meeting</span>
          <button
            style={btn(
              selected.isActive ? '#00d26a' : '#1a58c8',
              selected.isActive ? '#061b45' : '#cdd9e8'
            )}
            onClick={toggleLive}
          >
            {selected.isActive ? '● LIVE' : 'GO LIVE'}
          </button>
        </div>

        {/* Meeting info */}
        <div style={{ ...S.card, marginTop: '12px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={S.label}>Title</label>
            <input
              style={S.input}
              value={selected.title}
              onChange={e => updateTitle(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={S.label}>Date</label>
            <input
              style={S.input}
              value={selected.date}
              onChange={e => updateDate(e.target.value)}
            />
          </div>
          <div>
            <label style={S.label}>Executive Session Image URL</label>
            <input
              style={S.input}
              placeholder="https://... (leave blank to use default styled page)"
              value={(selected as any).execSessionImageUrl ?? ''}
              onChange={e => updateExecSessionUrl(e.target.value)}
            />
          </div>
          <p style={{ color: '#4a6080', fontSize: '11px', margin: '10px 0 0' }}>
            All fields auto-save as you type.
          </p>
        </div>

        {/* Agenda section */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 12px' }}>
            <span style={{ color: '#FFC107', fontSize: '12px', letterSpacing: '2px', fontWeight: '700' }}>
              AGENDA ITEMS
            </span>
            <span style={{ color: '#4a6080', fontSize: '12px' }}>
              {selected.agendaItems.length} item{selected.agendaItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {selected.agendaItems.length === 0 && (
            <p style={{ color: '#4a6080', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>
              No items yet. Add one below.
            </p>
          )}

          {selected.agendaItems.map((item, idx) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.isActive ? 'rgba(255,188,15,0.1)' : '#0a2e6b',
                border: item.isActive ? '1px solid rgba(255,188,15,0.35)' : '1px solid #1a58c8',
                borderRadius: '10px',
                padding: '14px 15px',
                marginBottom: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Number + text */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '11px' }}>
                <div
                  style={{
                    minWidth: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: item.isCompleted ? '#0a2e6b' : item.isActive ? '#ffbc0f' : '#1a58c8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: item.isCompleted ? '#4a6080' : item.isActive ? '#0c3877' : '#8ea6c8',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: '15px',
                    lineHeight: 1.4,
                    paddingTop: '3px',
                    color: item.isCompleted ? '#4a6080' : '#FFFFFF',
                    textDecoration: item.isCompleted ? 'line-through' : 'none',
                  }}
                >
                  {item.text}
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '7px' }}>
                <button
                  style={{
                    ...btn(
                      item.isActive ? '#ffbc0f' : '#1a58c8',
                      item.isActive ? '#0c3877' : '#cdd9e8',
                      { flex: 1, padding: '8px 6px' }
                    ),
                  }}
                  onClick={() => setActiveItem(item.id)}
                >
                  {item.isActive ? '● ACTIVE' : '▶ Set Active'}
                </button>
                <button
                  style={{
                    ...btn('transparent', item.isCompleted ? '#00d26a' : '#8ea6c8', {
                      border: item.isCompleted ? '1px solid #00d26a' : '1px solid #1a58c8',
                      padding: '8px 13px',
                    }),
                  }}
                  onClick={() => toggleComplete(item.id)}
                  title="Mark complete"
                >
                  ✓
                </button>
                <button
                  style={{
                    ...btn('transparent', '#c04040', {
                      border: '1px solid #2d1a1a',
                      padding: '8px 13px',
                    }),
                  }}
                  onClick={() => deleteItem(item.id)}
                  title="Delete item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Add item input */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              style={{ ...S.input, flex: 1 }}
              placeholder="Add agenda item…"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
            />
            <button
              style={btn('#ffbc0f', '#fff', { padding: '11px 18px', flexShrink: 0, fontSize: '20px' })}
              onClick={addItem}
            >
              +
            </button>
          </div>
        </div>

        {/* Delete meeting */}
        <div style={{ padding: '28px 16px 0' }}>
          <button
            style={{
              ...btn('transparent', '#c04040', {
                border: '1px solid #2d1a1a',
                width: '100%',
                padding: '13px',
                fontSize: '14px',
              }),
            }}
            onClick={deleteMeeting}
          >
            Delete Meeting
          </button>
        </div>
      </div>
    )
  }

  return null
}
