import { availability } from '../lib/spots.js'
import { distanceKm, formatDistance, walkMinutes } from '../lib/geo.js'
import { LANDMARKS } from '../data/landmarks.js'

const Chip = ({ on, onClick, children }) => (
  <button className={`chip${on ? ' chip--on' : ''}`} onClick={onClick}>{children}</button>
)

export default function ParkingList({ parkings, allCount, stats, onSelect, origin, setOrigin, onLocate, onFindBest, locating, filters, setFilters }) {
  const totalFree = parkings.reduce((s, p) => s + Math.max(0, stats[p.id].free), 0)
  const withDist = parkings.map((p) => ({ p, km: origin ? distanceKm(origin, p) : null }))
  const sorted = withDist.sort((a, b) =>
    origin ? a.km - b.km : stats[b.p.id].free - stats[a.p.id].free
  )
  const toggle = (k) => setFilters((f) => ({ ...f, [k]: !f[k] }))

  return (
    <div className="panel-body">
      <button className="find-btn" onClick={onFindBest} disabled={locating}>
        {locating ? 'Те барам…' : '🧭 Најди ми паркинг'}
      </button>

      <div className="search">
        <select
          value={origin && !origin.mine ? origin.id || '' : ''}
          onChange={(e) => setOrigin(LANDMARKS.find((l) => l.id === e.target.value) || null)}
        >
          <option value="">Каде одиш?</option>
          {LANDMARKS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <button className="icon-btn" onClick={onLocate} title="Моја локација">📍</button>
      </div>
      {origin && (
        <p className="origin-note">
          Подредено по растојание од <b>{origin.name}</b>{origin.fallback && ' (не можам да те лоцирам)'}
          {' · '}<button className="link" onClick={() => setOrigin(null)}>исчисти</button>
        </p>
      )}

      <div className="chips">
        <Chip on={filters.type === 'all'} onClick={() => setFilters((f) => ({ ...f, type: 'all' }))}>Сите</Chip>
        <Chip on={filters.type === 'garage'} onClick={() => setFilters((f) => ({ ...f, type: 'garage' }))}>Гаражи</Chip>
        <Chip on={filters.type === 'open'} onClick={() => setFilters((f) => ({ ...f, type: 'open' }))}>Отворени</Chip>
        <Chip on={filters.onlyFree} onClick={() => toggle('onlyFree')}>Има место</Chip>
        <Chip on={filters.cheap} onClick={() => toggle('cheap')}>до 40 ден</Chip>
        <Chip on={filters.accessible} onClick={() => toggle('accessible')}>♿</Chip>
        <Chip on={filters.ev} onClick={() => toggle('ev')}>⚡ полнач</Chip>
      </div>

      <div className="summary">
        <div><strong>{parkings.length}<small>/{allCount}</small></strong><span>паркинзи</span></div>
        <div><strong>{totalFree}</strong><span>слободни места</span></div>
      </div>

      {sorted.length === 0 && <p className="empty">Нема паркинг со овие филтри.</p>}
      <ul className="plist">
        {sorted.map(({ p, km }) => {
          const { free, total } = stats[p.id]
          const a = availability(free, total)
          return (
            <li key={p.id}>
              <button className="pitem" onClick={() => onSelect(p.id)}>
                <span className="dot" style={{ background: a.color }} />
                <span className="pitem__text">
                  <span className="pitem__name">{p.name}</span>
                  <span className="pitem__meta">
                    {km != null ? `${formatDistance(km)} · ${walkMinutes(km)} мин пешки · ` : `${p.type} · `}
                    {p.pricePerHour} ден/ч
                  </span>
                </span>
                <span className="pitem__free" style={{ color: a.color }}>
                  {Math.max(0, free)}<small>/{total}</small>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
