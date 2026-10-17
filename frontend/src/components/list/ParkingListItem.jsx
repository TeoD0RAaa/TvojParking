import { availability } from '../../utils/availability.js'
import { formatDistance, walkMinutes } from '../../utils/geo.js'
import { CITIES_BY_ID } from '../../data/cities.js'

// До 3 км: пешки. Подалеку: со кола (низ град 25 km/h, меѓу градови 70 km/h)
function howFar(km) {
  if (km <= 3) return `${formatDistance(km)} · ${walkMinutes(km)} мин пешки`
  const road = km * 1.4
  return `${formatDistance(km)} · ~${Math.round((road / (road > 15 ? 70 : 25)) * 60)} мин со кола`
}

export default function ParkingListItem({ parking, stat, km, onSelect, showCity = false }) {
  const { free, total } = stat
  const a = availability(free, total)
  const cityName = showCity ? `${CITIES_BY_ID[parking.city]?.name} · ` : ''
  const where = cityName + (km != null ? `${howFar(km)} · ` : `${parking.type} · `)

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
