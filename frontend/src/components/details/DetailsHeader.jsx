import { CITIES_BY_ID } from '../../data/cities.js'
import './details.css'

export default function DetailsHeader({ parking, onBack }) {
  return (
    <>
      <button className="back" onClick={onBack}>← Сите паркинзи</button>
      <h2 className="dname">{parking.name}</h2>
      <p className="dmeta">{CITIES_BY_ID[parking.city]?.name} · {parking.type} · {parking.address} · {parking.pricePerHour} ден/час</p>
      {parking.approx && <p className="muted approx-note">ℹ Демо: локацијата е приближна.</p>}
    </>
  )
}
