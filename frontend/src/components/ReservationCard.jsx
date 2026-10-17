import { QRCodeSVG } from 'qrcode.react'
import { GRACE_MIN } from '../lib/api.js'

const time = (ms) => new Date(ms).toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit', hour12: false })

export default function ReservationCard({ r, parking, now, onCheckIn, onCancel, onOpen }) {
  const deadline = r.createdAt + GRACE_MIN * 60_000
  const minsLeft = Math.min(GRACE_MIN, Math.max(0, Math.ceil((deadline - now) / 60_000)))
  return (
    <div className="rcard">
      <div className="rcard__qr">
        <QRCodeSVG value={JSON.stringify({ id: r.id, parking: r.parkingId, spot: r.spotId, plate: r.plate })} size={84} />
      </div>
      <div className="rcard__info">
        <button className="rcard__name link" onClick={onOpen}>{parking.name}</button>
        <div>Место <b>{r.spotId}</b> · {r.plate}</div>
        <div className="muted">до {time(r.until)} · {r.hours * parking.pricePerHour} ден</div>
        {r.checkedIn ? (
          <div className="ok">✓ Паркиран</div>
        ) : (
          <div className="warn">Пристигни за {minsLeft} мин или истекува</div>
        )}
        <div className="rcard__actions">
          {!r.checkedIn && <button className="small primary" onClick={onCheckIn}>Пристигнав</button>}
          <button className="small danger" onClick={onCancel}>Откажи</button>
        </div>
      </div>
    </div>
  )
}
