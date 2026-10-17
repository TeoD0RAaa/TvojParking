import { useState } from 'react'
import DriverFields from './DriverFields.jsx'
import DurationPicker from './DurationPicker.jsx'
import { KIND_LABEL } from '../../utils/spots.js'
import { isValidName, isValidPlate, normalizePlate } from '../../utils/format.js'
import './reserve.css'

// Долниот дел од деталите: совет, или форма за резервација на избраното место
export default function ReserveForm({ full, spot, pricePerHour, profile, presetHours, onReserve }) {
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')
  const [hours, setHours] = useState(presetHours || 2)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const valid = spot && isValidPlate(plate) && isValidName(name)

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setBusy(true); setError(null)
    try {
      await onReserve({ plate: normalizePlate(plate), hours, name: name.trim() })
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  if (full || !spot) {
    return (
      <form className="reserve">
        <p className="reserve__hint">
          {full ? 'Паркингот е полн. Пробај „Најди ми паркинг“ за најблизок слободен.' : 'Кликни на зелено место за да го резервираш.'}
        </p>
      </form>
    )
  }

  return (
    <form className="reserve" onSubmit={submit}>
      <div className="reserve__title">
        Резервација на место <b>{spot.id}</b>
        {spot.kind !== 'normal' && <span className="muted"> · {KIND_LABEL[spot.kind]}</span>}
      </div>
      <DriverFields name={name} setName={setName} plate={plate} setPlate={setPlate} />
      <DurationPicker value={hours} onChange={setHours} />
      {error && <p className="error">{error}</p>}
      <button className="cta" disabled={!valid || busy}>
        {busy ? 'Резервирам…' : `Резервирај · ${hours * pricePerHour} ден`}
      </button>
    </form>
  )
}
