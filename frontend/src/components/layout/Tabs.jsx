import './layout.css'

const NAV = [
  { id: 'list', icon: '🅿️', label: 'Паркинзи' },
  { id: 'assistant', icon: '💬', label: 'Асистент' },
  { id: 'scanner', icon: '📷', label: 'AI скенер' },
  { id: 'mine', icon: '🎫', label: 'Мои' },
]

// „Детали“ за паркинг спаѓаат под табот „Паркинзи“
const isOn = (tab, view) => view === tab || (tab === 'list' && view === 'details')

export default function Tabs({ view, mineCount, onChange }) {
  return (
    <nav className="tabs">
      {NAV.map((n) => (
        <button key={n.id} className={isOn(n.id, view) ? 'on' : ''} onClick={() => onChange(n.id)}>
          <span>{n.icon}</span> {n.label}
          {n.id === 'mine' && mineCount > 0 && <i className="count">{mineCount}</i>}
        </button>
      ))}
    </nav>
  )
}
