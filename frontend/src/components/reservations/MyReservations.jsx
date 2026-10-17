import ReservationCard from './ReservationCard.jsx'
import ProfileForm from './ProfileForm.jsx'
import { PARKINGS_BY_ID } from '../../data/parkings.js'
import CardView from '../wallet/CardView.jsx'
import PaymentHistory from '../wallet/PaymentHistory.jsx'
import '../wallet/wallet.css'
import './reservations.css'

export default function MyReservations({
  reservations, profile, setProfile, now, onCheckIn, onCancel, onOpen,
  user, onLogout, card, onSaveCard, onRemoveCard, payments,
}) {
  return (
    <div className="panel-body">
      <div className="user-row">
        <span className="user-row__avatar">{user.name[0]}</span>
        <span className="user-row__info"><b>{user.name}</b><span className="muted">{user.email}</span></span>
        <button className="small" onClick={onLogout}>Одјави се</button>
      </div>

      <h2 className="dname">Мои резервации</h2>
      <p className="dmeta">Покажи го QR кодот на рампата. Ако не пристигнеш навреме, резервацијата истекува. Откажување пред пристигнување = парите се враќаат.</p>

      {reservations.length === 0 && <p className="empty">Немаш активни резервации.</p>}
      {reservations.map((r) => (
        <ReservationCard key={r.id} r={r} parking={PARKINGS_BY_ID[r.parkingId]} now={now}
          onCheckIn={() => onCheckIn(r.id)} onCancel={() => onCancel(r.id)} onOpen={() => onOpen(r.parkingId)} />
      ))}

      <section className="wallet-section">
        <h3>💳 Картичка за плаќање</h3>
        <CardView card={card} onSave={onSaveCard} onRemove={onRemoveCard} />
      </section>

      <section className="wallet-section">
        <h3>🧾 Плаќања</h3>
        <PaymentHistory payments={payments} />
      </section>

      <ProfileForm profile={profile} setProfile={setProfile} />
    </div>
  )
}
