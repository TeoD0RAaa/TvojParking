import { useState } from 'react'
import ReservationCard from './ReservationCard.jsx'
import { PARKINGS_BY_ID } from '../data/parkings.js'
import { GRACE_MIN } from '../lib/api.js'

export default function MyReservations({ reservations, profile, setProfile, now, onCheckIn, onCancel, onOpen }) {
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')
  const save = (e) => { e.preventDefault(); if (name.trim()) setProfile({ name: name.trim(), plate: plate.trim().toUpperCase() }) }

  return (
    <div className="panel-body">
      <h2 className="dname">Мои резервации</h2>
      <p className="dmeta">Покажи го QR кодот на рампата. Ако не пристигнеш за {GRACE_MIN} мин, резервацијата истекува.</p>

      {reservations.length === 0 && <p className="empty">Немаш активни резервации.</p>}
      {reservations.map((r) => (
        <ReservationCard key={r.id} r={r} parking={PARKINGS_BY_ID[r.parkingId]} now={now}
          onCheckIn={() => onCheckIn(r.id)} onCancel={() => onCancel(r.id)} onOpen={() => onOpen(r.parkingId)} />
      ))}

      <form className="profile" onSubmit={save}>
        <h3>Профил</h3>
        <label>Име<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Теодора" /></label>
        <label>Регистарска<input className="upper" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="SK-1234-AB" /></label>
        <button className="small primary">Зачувај</button>
        {profile && <span className="muted"> Најавена како <b>{profile.name}</b></span>}
      </form>
    </div>
  )
}
