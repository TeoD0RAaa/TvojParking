import Chip from '../common/Chip.jsx'

const TYPES = [
  { id: 'all', label: 'Сите' },
  { id: 'garage', label: 'Гаражи' },
  { id: 'open', label: 'Отворени' },
]
const TOGGLES = [
  { key: 'onlyFree', label: 'Има место' },
  { key: 'cheap', label: 'до 40 ден' },
  { key: 'accessible', label: '♿' },
  { key: 'ev', label: '⚡ полнач' },
]

export default function FilterChips({ filters, setFilters }) {
  const setType = (type) => setFilters((f) => ({ ...f, type }))
  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }))

  return (
    <div className="chips">
      {TYPES.map((t) => <Chip key={t.id} on={filters.type === t.id} onClick={() => setType(t.id)}>{t.label}</Chip>)}
      {TOGGLES.map((t) => <Chip key={t.key} on={filters[t.key]} onClick={() => toggle(t.key)}>{t.label}</Chip>)}
    </div>
  )
}
