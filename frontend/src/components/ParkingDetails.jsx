import { useState } from 'react'
import { availability } from '../lib/spots.js'

const DURATIONS = [1, 2, 3, 4]

export default function ParkingDetails({ parking, spots, myReservations, onBack, onReserve, onCancel }) {
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [plate, setPlate] = useState('')
  const [hours, setHours] = useState(2)

  const mySpotIds = new Set(myReservations.map((r) => r.spotId))
  const free = spots.filter((s) => !s.taken && !mySpotIds.has(s.id)).length
  const a = availability(free, spots.length)

  const submit = (e) => {
    e.preventDefault()
    if (!selectedSpot || plate.trim().length < 4) return
    onReserve({ spotId: selectedSpot, plate: plate.trim().toUpperCase(), hours })
    setSelectedSpot(null)
  }

  return (
    <div className="panel-body">
      <button className="back" onClick={onBack}>← Сите паркинзи</button>

      <h2 className="dname">{parking.name}</h2>
      <p className="dmeta">{parking.address} · {parking.pricePerHour} ден/час</p>

      <div className="dstats">
        <div className="dstats__big" style={{ color: a.color }}>{free}<small> / {spots.length}</small></div>
        <div className="dstats__label">
          <span className="badge" style={{ background: a.color }}>{a.label}</span>
          слободни места
        </div>
        <div className="bar"><div style={{ width: `${(free / spots.length) * 100}%`, background: a.color }} /></div>
      </div>

      <div className="legend">
        <span><i className="spot spot--free" /> слободно</span>
        <span><i className="spot spot--taken" /> зафатено</span>
        <span><i className="spot spot--mine" /> твое</span>
      </div>

      {parking.blocks.map((b) => (
        <section key={b.name} className="block">
          <h3>{b.name}</h3>
          <div className="spots" style={{ gridTemplateColumns: `repeat(${b.perRow}, 1fr)` }}>
            {spots.filter((s) => s.block === b.name).map((s) => {
              const mine = mySpotIds.has(s.id)
              const state = mine ? 'mine' : s.taken ? 'taken' : selectedSpot === s.id ? 'selected' : 'free'
              return (
                <button
                  key={s.id}
                  className={`spot spot--${state}`}
                  disabled={s.taken || mine}
                  title={s.id}
                  onClick={() => setSelectedSpot(selectedSpot === s.id ? null : s.id)}
                >
                  {state === 'taken' ? '🚗' : state === 'mine' ? '★' : s.id.split('-')[1]}
                </button>
              )
            })}
          </div>
        </section>
      ))}

      {myReservations.length > 0 && (
        <section className="mine">
          <h3>Твои резервации тука</h3>
          {myReservations.map((r) => (
            <div key={r.id} className="mine__row">
              <span><b>{r.spotId}</b> · {r.plate} · до {new Date(r.until).toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' })}</span>
              <button onClick={() => onCancel(r.id)}>Откажи</button>
            </div>
          ))}
        </section>
      )}

      <form className="reserve" onSubmit={submit}>
        {free === 0 ? (
          <p className="reserve__hint">Паркингот е полн. Пробај некој зелен паркинг во близина.</p>
        ) : !selectedSpot ? (
          <p className="reserve__hint">Кликни на зелено место за да го резервираш.</p>
        ) : (
          <>
            <div className="reserve__title">Резервација на место <b>{selectedSpot}</b></div>
            <label>
              Регистарска таблица
              <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="SK-1234-AB" />
            </label>
            <div className="durations">
              {DURATIONS.map((h) => (
                <button type="button" key={h} className={h === hours ? 'on' : ''} onClick={() => setHours(h)}>
                  {h} ч
                </button>
              ))}
            </div>
            <button className="cta" disabled={plate.trim().length < 4}>
              Резервирај · {hours * parking.pricePerHour} ден
            </button>
          </>
        )}
      </form>
    </div>
  )
}
