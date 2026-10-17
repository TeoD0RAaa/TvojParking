import './layout.css'

const NAV = [
  { id: 'list', label: 'Паркинзи' },
  { id: 'assistant', label: 'Асистент' },
  { id: 'mine', label: 'Мои' },
]

// „Детали“ за паркинг спаѓаат под табот „Паркинзи“
const isOn = (tab, view) => view === tab || (tab === 'list' && view === 'details')

export default function Tabs({ view, mineCount, onChange }) {
  return (
    <nav className="tabs">
      {NAV.map((n) => (
        <button key={n.id} className={isOn(n.id, view) ? 'on' : ''} onClick={() => onChange(n.id)}>
          {n.label}
          {n.id === 'mine' && mineCount > 0 && <i className="count">{mineCount}</i>}
        </button>
      ))}
    </nav>
  )
}
