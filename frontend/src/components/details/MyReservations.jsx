import { formatTime } from '../../utils/format.js'
import './reserve.css'

export default function MyReservations({ reservations, onCancel }) {
  if (reservations.length === 0) return null
  return (
    <section className="mine">
      <h3>Твои резервации тука</h3>
      {reservations.map((r) => (
        <div key={r.id} className="mine__row">
          <span><b>{r.spotId}</b> · {r.plate} · до {formatTime(r.until)}</span>
          <button onClick={() => onCancel(r.id)}>Откажи</button>
        </div>
      ))}
    </section>
  )
}
