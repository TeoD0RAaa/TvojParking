import { directionsUrl, distanceKm, formatDistance, walkMinutes } from '../../utils/geo.js'
import './details.css'

// „Одведи ме“ (Google Maps правец) и колку е далеку
export default function DirectionsRow({ parking, origin }) {
  const km = origin ? distanceKm(origin, parking) : null
  return (
    <div className="nav-row">
      <a className="nav-btn" href={directionsUrl(parking)} target="_blank" rel="noreferrer">🧭 Одведи ме</a>
      {km != null && <span className="muted">{formatDistance(km)} од {origin.name} · ~{walkMinutes(km)} мин пешки</span>}
    </div>
  )
}
