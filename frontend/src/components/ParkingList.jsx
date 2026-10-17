import { availability } from '../lib/spots.js'

export default function ParkingList({ parkings, stats, onSelect }) {
  const totalFree = parkings.reduce((s, p) => s + stats[p.id].free, 0)
  const sorted = [...parkings].sort((a, b) => stats[b.id].free - stats[a.id].free)

  return (
    <div className="panel-body">
      <div className="summary">
        <div><strong>{parkings.length}</strong><span>паркинзи</span></div>
        <div><strong>{totalFree}</strong><span>слободни места</span></div>
      </div>
      <ul className="plist">
        {sorted.map((p) => {
          const { free, total } = stats[p.id]
          const a = availability(free, total)
          return (
            <li key={p.id}>
              <button className="pitem" onClick={() => onSelect(p.id)}>
                <span className="dot" style={{ background: a.color }} />
                <span className="pitem__text">
                  <span className="pitem__name">{p.name}</span>
                  <span className="pitem__meta">{p.type} · {p.pricePerHour} ден/ч</span>
                </span>
                <span className="pitem__free" style={{ color: a.color }}>
                  {free}<small>/{total}</small>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
