import { spotLabel } from '../../utils/spots.js'

export default function SpotButton({ spot, state, onClick }) {
  return (
    <button
      className={`spot spot--${state}`}
      disabled={state === 'taken' || state === 'mine'}
      title={spot.id}
      onClick={onClick}
    >
      {spotLabel(spot, state)}
    </button>
  )
}
