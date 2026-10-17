import { KIND_LABEL, spotLabel } from '../../utils/spots.js'

export default function SpotButton({ spot, state, onClick }) {
  const special = spot.kind !== 'normal' ? ' spot--special' : ''
  return (
    <button
      className={`spot spot--${state}${special}`}
      disabled={state === 'taken' || state === 'mine'}
      title={`${spot.id} · ${KIND_LABEL[spot.kind]}`}
      onClick={onClick}
    >
      {spotLabel(spot, state)}
    </button>
  )
}
