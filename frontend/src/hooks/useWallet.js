import { useState } from 'react'
import { load, save } from '../utils/storage.js'

/*
  Паричник на корисникот (демо): зачувана картичка + историја на плаќања.
  payments: [{ id, reservationId, parkingId, spotId, amount, card, at, status: 'paid' | 'refunded' }]
*/
export function useWallet(user) {
  const key = (name) => `tp.${name}.${user?.id || 'guest'}`
  const [card, setCardState] = useState(() => load(key('card'), null))
  const [payments, setPaymentsState] = useState(() => load(key('payments'), []))

  const setCard = (c) => { setCardState(c); save(key('card'), c) }
  const setPayments = (update) => setPaymentsState((prev) => {
    const next = update(prev)
    save(key('payments'), next)
    return next
  })

  const addPayment = (p) => setPayments((list) => [{ ...p, at: Date.now(), status: 'paid' }, ...list])

  // Откажување пред пристигнување -> парите се враќаат
  const refund = (reservationId) => {
    const p = payments.find((x) => x.reservationId === reservationId && x.status === 'paid')
    if (!p) return 0
    setPayments((list) => list.map((x) => (x.id === p.id ? { ...x, status: 'refunded' } : x)))
    return p.amount
  }

  return { card, setCard, removeCard: () => setCard(null), payments, addPayment, refund }
}
