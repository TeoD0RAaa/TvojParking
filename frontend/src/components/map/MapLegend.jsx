import { LEVELS } from '../../utils/availability.js'
import './map.css'

export default function MapLegend() {
  return (
    <div className="map-legend">
      {Object.entries(LEVELS).map(([key, level]) => (
        <span key={key}><i style={{ background: level.color }} /> {level.short}</span>
      ))}
    </div>
  )
}
