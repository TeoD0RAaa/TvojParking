import { availability } from '../../utils/availability.js'
import { pad2 } from '../../utils/format.js'

export default function ForecastBar({ slot, total, first, best }) {
  const a = availability(slot.free, total)
  const range = slot.error > 0 ? ` (± ${slot.error})` : ''
  return (
    <div className={`fbar${best ? ' fbar--best' : ''}`} title={`${pad2(slot.hour)}h: ~${slot.free} слободни${range}`}>
      <div className="fbar__track">
        <div className="fbar__fill" style={{ height: `${Math.max(4, (slot.free / total) * 100)}%`, background: a.color }} />
      </div>
      <span>{first ? 'сега' : slot.hour}</span>
    </div>
  )
}
