import ReservationCard from './ReservationCard.jsx'
import ProfileForm from './ProfileForm.jsx'
import { PARKINGS_BY_ID } from '../../data/parkings.js'
import { GRACE_MIN } from '../../utils/api/index.js'
import './reservations.css'

export default function MyReservations({ reservations, profile, setProfile, now, onCheckIn, onCancel, onOpen }) {
  return (
    <div className="panel-body">
      <h2 className="dname">Мои резервации</h2>
      <p className="dmeta">Покажи го QR кодот на рампата. Ако не пристигнеш за {GRACE_MIN} мин, резервацијата истекува.</p>

      {reservations.length === 0 && <p className="empty">Немаш активни резервации.</p>}
      {reservations.map((r) => (
        <ReservationCard key={r.id} r={r} parking={PARKINGS_BY_ID[r.parkingId]} now={now}
          onCheckIn={() => onCheckIn(r.id)} onCancel={() => onCancel(r.id)} onOpen={() => onOpen(r.parkingId)} />
      ))}

      <ProfileForm profile={profile} setProfile={setProfile} />
    </div>
  )
}
