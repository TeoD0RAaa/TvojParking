import { availability } from '../../utils/availability.js'
import './details.css'

// Голем број слободни места (+ ♿ и ⚡) и лента колку е полн паркингот
export default function AvailabilityCard({ parking, stat }) {
  const a = availability(stat.free, stat.total)
  const free = Math.max(0, stat.free)
  return (
    <div className="dstats">
      <div className="dstats__big" style={{ color: a.color }}>{free}<small> / {stat.total}</small></div>
      <div className="dstats__label">
        <span className="badge" style={{ background: a.color }}>{a.label}</span>
        слободни места · ♿ {stat.freeAccessible}{parking.ev && <> · ⚡ {stat.freeEv}</>}
      </div>
      <div className="bar"><div style={{ width: `${(free / stat.total) * 100}%`, background: a.color }} /></div>
    </div>
  )
}
