// Резервациите засега се чуваат во прелистувачот (localStorage)
const STORE_KEY = 'tvojparking.reservations'
const HOUR_MS = 3600_000

export function loadReservations() {
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY)) || []
    return all.filter((r) => r.until > Date.now()) // истечените се бришат
  } catch { return [] }
}

export function saveReservations(reservations) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(reservations)) } catch {}
}

export function createReservation({ parkingId, spotId, plate, hours }) {
  return { id: crypto.randomUUID(), parkingId, spotId, plate, hours, until: Date.now() + hours * HOUR_MS }
}

export const reservationsFor = (reservations, parkingId) => reservations.filter((r) => r.parkingId === parkingId)
