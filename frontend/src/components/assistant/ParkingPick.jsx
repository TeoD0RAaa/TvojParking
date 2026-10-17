import { PARKINGS_BY_ID } from '../../data/parkings.js'

export default function ParkingPick({ id, stat, onClick }) {
  const parking = PARKINGS_BY_ID[id]
  return (
    <button className="pick" onClick={onClick}>
      <b>{parking.name}</b>
      <span>{Math.max(0, stat.free)} слободни · {parking.pricePerHour} ден/ч →</span>
    </button>
  )
}
