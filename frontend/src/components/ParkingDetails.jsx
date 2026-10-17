import { useState } from 'react'
import { availability, KIND_LABEL } from '../lib/spots.js'
import { distanceKm, formatDistance, walkMinutes, directionsUrl } from '../lib/geo.js'
import Forecast from './Forecast.jsx'
import ReservationCard from './ReservationCard.jsx'

const DURATIONS = [1, 2, 3, 4]

export default function ParkingDetails({
  parking, spots, stat, reservedIds, myReservations, profile, origin, now, presetHours,
  onBack, onReserve, onCheckIn, onCancel,
}) {
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')
  const [hours, setHours] = useState(presetHours || 2)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const mySpotIds = new Set(myReservations.map((r) => r.spotId))
  const a = availability(stat.free, stat.total)
  const km = origin ? distanceKm(origin, parking) : null
  const spot = spots.find((s) => s.id === selectedSpot)
  const valid = selectedSpot && plate.trim().length >= 4 && name.trim().length >= 2

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setBusy(true); setError(null)
    try {
      await onReserve({ spotId: selectedSpot, plate: plate.trim().toUpperCase(), hours, name: name.trim() })
      setSelectedSpot(null)
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  return (
    <div className="panel-body">
      <button className="back" onClick={onBack}>← Сите паркинзи</button>

      <h2 className="dname">{parking.name}</h2>
      <p className="dmeta">{parking.type} · {parking.address} · {parking.pricePerHour} ден/час</p>

      <div className="dstats">
        <div className="dstats__big" style={{ color: a.color }}>{Math.max(0, stat.free)}<small> / {stat.total}</small></div>
        <div className="dstats__label">
          <span className="badge" style={{ background: a.color }}>{a.label}</span>
          слободни места · ♿ {stat.freeAccessible}{parking.ev && <> · ⚡ {stat.freeEv}</>}
        </div>
        <div className="bar"><div style={{ width: `${(Math.max(0, stat.free) / stat.total) * 100}%`, background: a.color }} /></div>
      </div>

      <div className="nav-row">
        <a className="nav-btn" href={directionsUrl(parking)} target="_blank" rel="noreferrer">🧭 Одведи ме</a>
        {km != null && <span className="muted">{formatDistance(km)} од {origin.name} · ~{walkMinutes(km)} мин пешки</span>}
      </div>

      <Forecast parking={parking} total={stat.total} />

      {myReservations.length > 0 && (
        <section className="mine-here">
          <h3>Твои резервации тука</h3>
          {myReservations.map((r) => (
            <ReservationCard key={r.id} r={r} parking={parking} now={now}
              onCheckIn={() => onCheckIn(r.id)} onCancel={() => onCancel(r.id)} onOpen={() => {}} />
          ))}
        </section>
      )}

      <div className="legend">
        <span><i className="spot spot--free" /> слободно</span>
        <span><i className="spot spot--taken" /> зафатено</span>
        <span><i className="spot spot--mine" /> твое</span>
        <span>♿ ⚡ посебни</span>
      </div>

      {parking.blocks.map((b) => (
        <section key={b.name} className="block">
          <h3>{b.name}</h3>
          <div className="spots" style={{ gridTemplateColumns: `repeat(${b.perRow}, 1fr)` }}>
            {spots.filter((s) => s.block === b.name).map((s) => {
              const mine = mySpotIds.has(s.id)
              const taken = s.taken || (reservedIds.has(s.id) && !mine)
              const state = mine ? 'mine' : taken ? 'taken' : selectedSpot === s.id ? 'selected' : 'free'
              const icon = s.kind === 'accessible' ? '♿' : s.kind === 'ev' ? '⚡' : s.id.split('-')[1]
              return (
                <button
                  key={s.id}
                  className={`spot spot--${state}${s.kind !== 'normal' ? ' spot--special' : ''}`}
                  disabled={taken || mine}
                  title={`${s.id} · ${KIND_LABEL[s.kind]}`}
                  onClick={() => setSelectedSpot(selectedSpot === s.id ? null : s.id)}
                >
                  {state === 'taken' ? '🚗' : state === 'mine' ? '★' : icon}
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <form className="reserve" onSubmit={submit}>
        {stat.free <= 0 ? (
          <p className="reserve__hint">Паркингот е полн. Пробај „Најди ми паркинг“ за најблизок слободен.</p>
        ) : !selectedSpot ? (
          <p className="reserve__hint">Кликни на зелено место за да го резервираш.</p>
        ) : (
          <>
            <div className="reserve__title">
              Резервација на место <b>{selectedSpot}</b>
              {spot && spot.kind !== 'normal' && <span className="muted"> · {KIND_LABEL[spot.kind]}</span>}
            </div>
            <div className="reserve__row">
              <label>Име<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Теодора" /></label>
              <label>Регистарска<input className="upper" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="SK-1234-AB" /></label>
            </div>
            <div className="durations">
              {DURATIONS.map((h) => (
                <button type="button" key={h} className={h === hours ? 'on' : ''} onClick={() => setHours(h)}>{h} ч</button>
              ))}
            </div>
            {error && <p className="error">{error}</p>}
            <button className="cta" disabled={!valid || busy}>
              {busy ? 'Резервирам…' : `Резервирај · ${hours * parking.pricePerHour} ден`}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
