import { availability } from '../../utils/availability.js'
import { pad2 } from '../../utils/format.js'

export default function ForecastBar({ slot, total, first, best }) {
  const a = availability(slot.free, total)
  return (
    <div className={`fbar${best ? ' fbar--best' : ''}`} title={`${pad2(slot.hour)}h: ~${slot.free} слободни`}>
      <div className="fbar__track">
        <div className="fbar__fill" style={{ height: `${Math.max(4, (slot.free / total) * 100)}%`, background: a.color }} />
      </div>
      <span>{first ? 'сега' : slot.hour}</span>
    </div>
  )
}
