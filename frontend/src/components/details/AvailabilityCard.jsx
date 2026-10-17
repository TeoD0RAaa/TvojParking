import { availability } from '../../utils/availability.js'
import './details.css'

// Голем број слободни места + лента колку е полн паркингот
export default function AvailabilityCard({ free, total }) {
  const a = availability(free, total)
  return (
    <div className="dstats">
      <div className="dstats__big" style={{ color: a.color }}>{free}<small> / {total}</small></div>
      <div className="dstats__label">
        <span className="badge" style={{ background: a.color }}>{a.label}</span>
        слободни места
      </div>
      <div className="bar"><div style={{ width: `${(free / total) * 100}%`, background: a.color }} /></div>
    </div>
  )
}
