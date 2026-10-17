import { useState } from 'react'
import DurationPicker from './DurationPicker.jsx'
import { isValidPlate, normalizePlate } from '../../utils/format.js'
import './reserve.css'

// Долниот дел од деталите: совет, или форма за резервација на избраното место
export default function ReserveForm({ full, spotId, pricePerHour, onReserve }) {
  const [plate, setPlate] = useState('')
  const [hours, setHours] = useState(2)
  const valid = isValidPlate(plate)

  const submit = (e) => {
    e.preventDefault()
    if (!spotId || !valid) return
    onReserve({ plate: normalizePlate(plate), hours })
  }

  return (
    <form className="reserve" onSubmit={submit}>
      {full ? (
        <p className="reserve__hint">Паркингот е полн. Пробај некој зелен паркинг во близина.</p>
      ) : !spotId ? (
        <p className="reserve__hint">Кликни на зелено место за да го резервираш.</p>
      ) : (
        <>
          <div className="reserve__title">Резервација на место <b>{spotId}</b></div>
          <label>
            Регистарска таблица
            <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="SK-1234-AB" />
          </label>
          <DurationPicker value={hours} onChange={setHours} />
          <button className="cta" disabled={!valid}>
            Резервирај · {hours * pricePerHour} ден
          </button>
        </>
      )}
    </form>
  )
}
