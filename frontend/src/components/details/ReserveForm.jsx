import { useState } from 'react'
import DriverFields from './DriverFields.jsx'
import { MAX_HOURS } from '../../utils/api/index.js'
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
  Резервација без бирање место: избираш само вид (обично / ♿ / ⚡),
  а системот ти го дава следното слободно место по ред.
  Нема бирање часови: почнува со 1 ч, а секој нов започнат час се доплаќа.
*/
export default function ReserveForm({ parking, kind, setKind, next, stat, pricePerHour, profile, onReserve }) {
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const trip = useTravelTime(parking, true) // колку ти треба до тука -> толку време имаш да пристигнеш
  const valid = next && trip && isValidPlate(plate) && isValidName(name)

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setBusy(true); setError(null)
    try {
      await onReserve({ plate: normalizePlate(plate), name: name.trim(), graceMin: trip.graceMin })
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
          <DriverFields name={name} setName={setName} plate={plate} setPlate={setPlate} />
          <p className="reserve__price">
            Се плаќа по час: <b>{pricePerHour} ден</b> за првиот час веднаш, па уште {pricePerHour} ден за секој нов започнат час
            (најмногу {MAX_HOURS} ч).
          </p>
          <p className="reserve__eta">
            {trip
              ? <>🚗 ~{trip.driveMin} мин до тука{trip.source === 'google' ? ' (Google, со сообраќај)' : ' (проценка)'}
                  {trip.from?.fallback && ' од центар'} → имаш <b>{trip.graceMin} мин</b> да пристигнеш (+{EXTRA_MIN} мин резерва)</>
              : '🚗 Пресметувам колку ти треба до тука…'}
          </p>
          {error && <p className="error">{error}</p>}
          <button className="cta" disabled={!valid || busy}>
            {busy ? 'Резервирам…' : `Резервирај место · ${pricePerHour} ден/ч`}
          </button>
        </>
      )}
    </form>
  )
}
