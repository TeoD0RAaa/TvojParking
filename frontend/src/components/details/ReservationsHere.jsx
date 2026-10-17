import ReservationCard from '../reservations/ReservationCard.jsx'
import './details.css'

// Твоите резервации на овој паркинг
export default function ReservationsHere({ reservations, parking, now, onCheckIn, onCancel }) {
  if (reservations.length === 0) return null
  return (
    <section className="mine-here">
      <h3>Твои резервации тука</h3>
      {reservations.map((r) => (
        <ReservationCard key={r.id} r={r} parking={parking} now={now}
          onCheckIn={() => onCheckIn(r.id)} onCancel={() => onCancel(r.id)} onOpen={() => {}} />
      ))}
    </section>
  )
}
