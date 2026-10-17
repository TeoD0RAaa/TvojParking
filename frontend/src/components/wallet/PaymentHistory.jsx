import { PARKINGS_BY_ID } from '../../data/parkings.js'
import { pad2 } from '../../utils/format.js'
import './wallet.css'

// 17.10 15:12
const fmt = (ms) => { const d = new Date(ms); return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}` }

// Историја на плаќања (платено / вратено)
export default function PaymentHistory({ payments }) {
  if (payments.length === 0) return <p className="muted">Сè уште немаш плаќања.</p>
  const spent = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  return (
    <div className="payments">
      {payments.map((p) => (
        <div key={p.id} className={`pay pay--${p.status}`}>
          <div>
            <b>{PARKINGS_BY_ID[p.parkingId]?.name || p.parkingId}</b>
            <div className="muted">место {p.spotId} · {fmt(p.at)} · {p.card}</div>
          </div>
          <div className="pay__amount">
            {p.status === 'refunded' ? <><s>{p.amount} ден</s><small>вратено</small></> : <>−{p.amount} ден</>}
          </div>
        </div>
      ))}
      <div className="payments__total">Вкупно платено: <b>{spent} ден</b></div>
    </div>
  )
}
