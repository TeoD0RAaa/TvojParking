import SpotButton from './SpotButton.jsx'
import { spotState } from '../../utils/spots.js'
import './spots.css'

// Еден блок / кат од паркингот со мрежа од места
export default function SpotBlock({ block, spots, mySpotIds, selectedSpot, onToggle }) {
  return (
    <section className="block">
      <h3>{block.name}</h3>
      <div className="spots" style={{ gridTemplateColumns: `repeat(${block.perRow}, 1fr)` }}>
        {spots.map((s) => (
          <SpotButton key={s.id} spot={s} state={spotState(s, mySpotIds, selectedSpot)} onClick={() => onToggle(s.id)} />
        ))}
      </div>
    </section>
  )
}
