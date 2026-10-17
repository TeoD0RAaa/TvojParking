import { useState } from 'react'
import { TEST_CARD, cardBrand, formatCardNumber, formatExp, safeCard, validateCard } from '../../utils/payment.js'
import './wallet.css'

// Форма за додавање картичка (ДЕМО — се зачувуваат само последните 4 цифри)
export default function CardForm({ onSave, onCancel }) {
  const [f, setF] = useState({ number: '', exp: '', cvc: '', holder: '' })
  const [errors, setErrors] = useState({})
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }

  // div (не form), за да може да стои и внатре во формата за резервација
  const submit = () => {
    const v = validateCard(f)
    if (!v.ok) return setErrors(v.errors)
    onSave(safeCard(f))
  }

  return (
    <div className="cardform">
      <div className="cardform__head">
        <b>Нова картичка</b>
        <button type="button" className="link" onClick={() => { setF(TEST_CARD); setErrors({}) }}>Пополни тест картичка</button>
      </div>
      <label>Број на картичка
        <input inputMode="numeric" value={f.number} placeholder="4242 4242 4242 4242"
          onChange={(e) => set('number', formatCardNumber(e.target.value))} />
        {f.number && !errors.number && <small className="muted">{cardBrand(f.number)}</small>}
        {errors.number && <small className="error">{errors.number}</small>}
      </label>
      <div className="cardform__row">
        <label>Важи до
          <input inputMode="numeric" value={f.exp} placeholder="ММ/ГГ" onChange={(e) => set('exp', formatExp(e.target.value))} />
          {errors.exp && <small className="error">{errors.exp}</small>}
        </label>
        <label>CVC
          <input inputMode="numeric" value={f.cvc} placeholder="123" maxLength={4} onChange={(e) => set('cvc', e.target.value.replace(/\D/g, ''))} />
          {errors.cvc && <small className="error">{errors.cvc}</small>}
        </label>
      </div>
      <label>Име на картичката
        <input className="upper" value={f.holder} placeholder="TEODORA" onChange={(e) => set('holder', e.target.value)} />
        {errors.holder && <small className="error">{errors.holder}</small>}
      </label>
      <p className="muted cardform__note">🔒 Демо: ништо не се наплаќа. Не внесувај вистинска картичка — користи ја тест картичката.</p>
      <div className="cardform__actions">
        <button type="button" className="small primary" onClick={submit}>Зачувај картичка</button>
        {onCancel && <button type="button" className="small" onClick={onCancel}>Откажи</button>}
      </div>
    </div>
  )
}
