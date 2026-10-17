import './details.css'

export default function DetailsHeader({ parking, onBack }) {
  return (
    <>
      <button className="back" onClick={onBack}>← Сите паркинзи</button>
      <h2 className="dname">{parking.name}</h2>
      <p className="dmeta">{parking.type} · {parking.address} · {parking.pricePerHour} ден/час</p>
    </>
  )
}
