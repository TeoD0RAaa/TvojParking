import { useState } from 'react'
import DriverFields from './DriverFields.jsx'
import DurationPicker from './DurationPicker.jsx'
import { EXTRA_MIN } from '../../utils/travelTime.js'
import { useTravelTime } from '../../hooks/useTravelTime.js'
import { isValidName, isValidPlate, normalizePlate } from '../../utils/format.js'
import './reserve.css'

const FULL_TEXT = {
  normal: 'Нема слободни обични места. Пробај „Најди ми паркинг“ за најблизок слободен.',
  accessible: 'Нема слободни ♿ места на овој паркинг.',
  ev: 'Нема слободни ⚡ места за полнење на овој паркинг.',
}

/*
  Резервација без бирање место: избираш само вид (обично / ♿ / ⚡) и колку часа,
  а системот ти го дава следното слободно место по ред.
*/
export default function ReserveForm({ parking, kind, setKind, next, stat, pricePerHour, profile, presetHours, onReserve }) {
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')
  const [hours, setHours] = useState(presetHours || 2)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const trip = useTravelTime(parking, true) // колку ти треба до тука -> толку време имаш да пристигнеш
  const valid = next && trip && isValidPlate(plate) && isValidName(name)

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setBusy(true); setError(null)
    try {
      await onReserve({ plate: normalizePlate(plate), hours, name: name.trim(), graceMin: trip.graceMin })
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  const kinds = [
    { id: 'normal', label: 'Обично' },
    { id: 'accessible', label: `♿ Попреченост (${stat.freeAccessible})` },
    ...(parking.ev ? [{ id: 'ev', label: `⚡ Полнење (${stat.freeEv})` }] : []),
  ]

  return (
    <form className="reserve" onSubmit={submit}>
      <div className="kinds">
        {kinds.map((k) => (
          <button key={k.id} type="button" className={kind === k.id ? 'on' : ''} onClick={() => { setKind(k.id); setError(null) }}>
            {k.label}
          </button>
        ))}
      </div>

      {!next ? <p className="reserve__hint">{FULL_TEXT[kind]}</p> : (
        <>
          <div className="reserve__title">Ќе го добиеш место <b>{next.id}</b> <span className="muted">(следното слободно по ред)</span></div>
          <DriverFields name={name} setName={setName} plate={plate} setPlate={setPlate} />
          <DurationPicker value={hours} onChange={setHours} />
          <p className="reserve__eta">
            {trip
              ? <>🚗 ~{trip.driveMin} мин до тука{trip.source === 'google' ? ' (Google, со сообраќај)' : ' (проценка)'}
                  {trip.from?.fallback && ' од центар'} → имаш <b>{trip.graceMin} мин</b> да пристигнеш (+{EXTRA_MIN} мин резерва)</>
              : '🚗 Пресметувам колку ти треба до тука…'}
          </p>
          {error && <p className="error">{error}</p>}
          <button className="cta" disabled={!valid || busy}>
            {busy ? 'Резервирам…' : `Резервирај место · ${hours * pricePerHour} ден`}
          </button>
        </>
      )}
    </form>
  )
}
