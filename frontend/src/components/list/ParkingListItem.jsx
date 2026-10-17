import { availability } from '../../utils/availability.js'

export default function ParkingListItem({ parking, stat, onSelect }) {
  const { free, total } = stat
  const a = availability(free, total)
  return (
    <li>
      <button className="pitem" onClick={() => onSelect(parking.id)}>
        <span className="dot" style={{ background: a.color }} />
        <span className="pitem__text">
          <span className="pitem__name">{parking.name}</span>
          <span className="pitem__meta">{parking.type} · {parking.pricePerHour} ден/ч</span>
        </span>
        <span className="pitem__free" style={{ color: a.color }}>
          {free}<small>/{total}</small>
        </span>
      </button>
    </li>
  )
}
