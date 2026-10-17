import { useState } from 'react'
import DriverFields from './DriverFields.jsx'
import { MAX_HOURS } from '../../utils/api/index.js'
import { EXTRA_MIN } from '../../utils/travelTime.js'
import { useTravelTime } from '../../hooks/useTravelTime.js'
import { isValidName, isValidPlate, normalizePlate } from '../../utils/format.js'
import CardForm from '../wallet/CardForm.jsx'
import './reserve.css'

const FULL_TEXT = {
  normal: 'Нема слободни обични места. Пробај „Најди ми паркинг“ за најблизок слободен.',
  accessible: 'Нема слободни ♿ места на овој паркинг.',
  ev: 'Нема слободни ⚡ места за полнење на овој паркинг.',
}

/*
  Резервација без бирање место: избираш само вид (обично / ♿ / ⚡),
  а системот ти го дава следното слободно место по ред.
  Без зачувана картичка не може да се резервира — прво се додава картичка, па се плаќа.
*/
export default function ReserveForm({ parking, kind, setKind, next, stat, pricePerHour, profile, card, onSaveCard, onReserve }) {
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false) // плаќањето трае малку
  const trip = useTravelTime(parking, true) // колку ти треба до тука -> толку време имаш да пристигнеш
  const valid = next && trip && card && isValidPlate(plate) && isValidName(name)
  const amount = pricePerHour // сега се плаќа само првиот час, останатите на крајот на паркирањето

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
    <form className={`reserve${next && !card ? ' reserve--static' : ''}`} onSubmit={submit}>
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
          {!card ? (
            <>
              <p className="reserve__nocard">💳 За да резервираш, прво додај картичка.</p>
              <CardForm onSave={onSaveCard} />
            </>
          ) : (
            <>
              <div className="reserve__pay">
                <span>Плаќање со <b>{card.brand} •••• {card.last4}</b></span>
                <span className="reserve__amount">{amount} ден <small className="muted">прв час</small></span>
              </div>
              {error && <p className="error">{error}</p>}
              <button className="cta" disabled={!valid || busy}>
                {busy ? '⏳ Се обработува плаќањето…' : `Плати ${amount} ден и резервирај`}
              </button>
            </>
          )}
        </>
      )}
    </form>
  )
}
