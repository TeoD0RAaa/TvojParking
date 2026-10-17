import { availability } from '../../utils/availability.js'
import { formatDistance, walkMinutes } from '../../utils/geo.js'

export default function ParkingListItem({ parking, stat, km, onSelect }) {
  const { free, total } = stat
  const a = availability(free, total)
  const where = km != null ? `${formatDistance(km)} · ${walkMinutes(km)} мин пешки · ` : `${parking.type} · `

  return (
    <li>
      <button className="pitem" onClick={() => onSelect(parking.id)}>
        <span className="dot" style={{ background: a.color }} />
        <span className="pitem__text">
          <span className="pitem__name">{parking.name}</span>
          <span className="pitem__meta">{where}{parking.pricePerHour} ден/ч</span>
        </span>
        <span className="pitem__free" style={{ color: a.color }}>
          {Math.max(0, free)}<small>/{total}</small>
        </span>
      </button>
    </li>
  )
}
