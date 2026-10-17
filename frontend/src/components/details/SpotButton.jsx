import { KIND_LABEL, spotIcon } from '../../utils/spots.js'

const BADGE = { accessible: '♿', ev: '⚡' }

// Едно место (само за приказ, не се кликнува): (икона) + број.
// ♿ / ⚡ места имаат мала ознака во аголот и кога се зафатени.
export default function SpotButton({ spot, state }) {
  const special = spot.kind !== 'normal' ? ` spot--${spot.kind}` : ''
  const icon = state === 'next' ? '➜' : spotIcon(spot, state)
  const badge = (state === 'taken' || state === 'mine' || state === 'next') && BADGE[spot.kind]
  return (
    <div className={`spot spot--${state}${special}`} title={`Место ${spot.id} · ${KIND_LABEL[spot.kind]}`}>
      {badge && <span className="spot__badge">{badge}</span>}
      {icon && <span className="spot__icon">{icon}</span>}
      <span className="spot__num">{spot.id}</span>
    </div>
  )
}
