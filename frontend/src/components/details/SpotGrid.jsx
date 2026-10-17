import SpotButton from './SpotButton.jsx'
import { spotState } from '../../utils/spots.js'
import './spots.css'

// Сите места по ред (само приказ): ♿ први, па 01, 02, 03 … Местата не се бираат —
// при резервација автоматски го добиваш следното слободно (означено со ➜).
export default function SpotGrid({ spots, states }) {
  return (
    <section className="spot-grid">
      <div className="spots">
        {spots.map((s) => <SpotButton key={s.id} spot={s} state={spotState(s, states)} />)}
      </div>
    </section>
  )
}
