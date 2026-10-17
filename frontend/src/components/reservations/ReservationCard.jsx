import { QRCodeSVG } from 'qrcode.react'
import { billedHours, graceMinutesLeft, qrPayload } from '../../utils/api/index.js'
import { formatTime } from '../../utils/format.js'
import './reservations.css'

export default function ReservationCard({ r, parking, now, onCheckIn, onCancel, onOpen }) {
  const hours = billedHours(r, now)
  return (
    <div className="rcard">
      <div className="rcard__qr">
        <QRCodeSVG value={qrPayload(r)} size={84} />
      </div>
      <div className="rcard__info">
        <button className="rcard__name link" onClick={onOpen}>{parking.name}</button>
        <div>Место <b>{r.spotId}</b> · {r.plate}</div>
        <div className="muted">од {formatTime(r.createdAt)} · {hours} ч · {hours * parking.pricePerHour} ден</div>
        {r.checkedIn
          ? <div className="ok">✓ Паркиран</div>
          : <div className="warn">Пристигни за {graceMinutesLeft(r, now)} мин или истекува</div>}
        <div className="rcard__actions">
          {!r.checkedIn && <button className="small primary" onClick={onCheckIn}>Пристигнав</button>}
          <button className="small danger" onClick={onCancel}>{r.checkedIn ? 'Заврши паркирање' : 'Откажи'}</button>
        </div>
      </div>
    </div>
  )
}
