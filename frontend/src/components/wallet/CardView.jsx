import { useState } from 'react'
import CardForm from './CardForm.jsx'
import './wallet.css'

// Зачуваната картичка (или копче за додавање)
export default function CardView({ card, onSave, onRemove }) {
  const [adding, setAdding] = useState(false)
  if (adding || !card) {
    return adding
      ? <CardForm onSave={(c) => { onSave(c); setAdding(false) }} onCancel={() => setAdding(false)} />
      : <button className="addcard" onClick={() => setAdding(true)}>💳 Додај картичка</button>
  }
  return (
    <div className="ccard">
      <div className="ccard__brand">{card.brand}</div>
      <div className="ccard__num">•••• •••• •••• {card.last4}</div>
      <div className="ccard__foot"><span>{card.holder}</span><span>{card.exp}</span></div>
      <div className="ccard__actions">
        <button className="small" onClick={() => setAdding(true)}>Смени</button>
        <button className="small danger" onClick={onRemove}>Отстрани</button>
      </div>
    </div>
  )
}
