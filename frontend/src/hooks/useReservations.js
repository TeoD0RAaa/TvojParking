import { useEffect, useState } from 'react'
import { createReservation, loadReservations, saveReservations } from '../utils/reservations.js'

export function useReservations() {
  const [reservations, setReservations] = useState(loadReservations)

  useEffect(() => { saveReservations(reservations) }, [reservations])

  const reserve = (data) => {
    const r = createReservation(data)
    setReservations((list) => [...list, r])
    return r
  }
  const cancel = (id) => setReservations((list) => list.filter((r) => r.id !== id))

  return { reservations, reserve, cancel }
}
