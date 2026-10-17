export const KIND_LABEL = { accessible: '♿ за лица со попреченост', ev: '⚡ полнење за електрично возило', normal: 'обично место' }

const EV_SPOTS = 2 // последните 2 места се за полнење (ако паркингот има полначи)

// Нема блокови: сите места се во еден ред по број.
// Првите `parking.accessible` места се ♿, последните 2 се ⚡ (ако има полначи), другите се обични.
function spotKind(parking, n) {
  if (n <= parking.accessible) return 'accessible'
  if (parking.ev && n > parking.capacity - EV_SPOTS) return 'ev'
  return 'normal'
}

// Ги прави сите места на паркингот, нумерирани по ред: 01, 02, 03 …
// [{ id: '07', n: 7, taken: true, kind: 'normal' | 'accessible' | 'ev' }, ...]
export function buildSpots(parking) {
  const digits = Math.max(2, String(parking.capacity).length)
  const spots = []
  for (let n = 1; n <= parking.capacity; n++) {
    spots.push({ id: String(n).padStart(digits, '0'), n, taken: false, kind: spotKind(parking, n) })
  }
  setTakenCount(spots, Math.round(spots.length * parking.occupancy))
  return spots
}

/*
  Точно n места да бидат зафатени — ПО РЕД, не случајно.
  ♿ местата се пополнуваат посебно (сразмерно), другите: 01, 02, 03 … по ред.
  Не ги допира резервираните.
*/
export function setTakenCount(spots, n, reserved = new Set()) {
  const pool = spots.filter((s) => !reserved.has(s.id))
  const acc = pool.filter((s) => s.kind === 'accessible')
  const rest = pool.filter((s) => s.kind !== 'accessible')
  const ratio = spots.length ? Math.min(1, n / spots.length) : 0
  const accTaken = Math.round(acc.length * ratio)
  acc.forEach((s, i) => { s.taken = i < accTaken })
  const restTaken = Math.min(rest.length, n - accTaken)
  rest.forEach((s, i) => { s.taken = i < restTaken })
}

const isFree = (s, reservedIds) => !s.taken && !reservedIds.has(s.id)

/*
  Следното слободно место по ред за даден вид:
    'accessible' -> првото слободно ♿ место
    'ev'         -> првото слободно ⚡ место
    'normal'     -> првото слободно обично место (не ги зема ♿ и ⚡)
*/
export const nextFreeSpot = (spots, reservedIds, kind = 'normal') =>
  spots.find((s) => s.kind === kind && isFree(s, reservedIds)) || null

// Состојба на место за приказ: mine / taken / next (тоа ќе го добиеш) / free
export function spotState(spot, { mySpotIds, reservedIds, nextId }) {
  if (mySpotIds.has(spot.id)) return 'mine'
  if (spot.taken || reservedIds.has(spot.id)) return 'taken'
  if (nextId === spot.id) return 'next'
  return 'free'
}

// Иконата над бројот на местото (бројот секогаш се гледа)
export function spotIcon(spot, state) {
  if (state === 'taken') return '🚗'
  if (state === 'mine') return '★'
  if (spot.kind === 'accessible') return '♿'
  if (spot.kind === 'ev') return '⚡'
  return null
}
