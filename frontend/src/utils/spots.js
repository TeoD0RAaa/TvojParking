import { seededRandom } from './random.js'

const BLOCK_LETTERS = 'АБВГДЃЕ'

export const KIND_LABEL = { accessible: '♿ за лица со попреченост', ev: '⚡ полнење за електрично возило', normal: 'обично место' }

// првите 2 места во првиот блок се за лица со попреченост, последните 2 во последниот = полнење
function spotKind(parking, blockIndex, i, count) {
  if (blockIndex === 0 && i <= 2) return 'accessible'
  if (parking.ev && blockIndex === parking.blocks.length - 1 && i > count - 2) return 'ev'
  return 'normal'
}

// Ги прави сите места на паркингот:
// [{ id: 'А-07', block: 'Блок А', taken: true, kind: 'normal' | 'accessible' | 'ev' }, ...]
export function buildSpots(parking) {
  const spots = []
  parking.blocks.forEach((b, bi) => {
    const count = b.rows * b.perRow
    for (let i = 1; i <= count; i++) {
      const id = `${BLOCK_LETTERS[bi]}-${String(i).padStart(2, '0')}`
      spots.push({ id, block: b.name, taken: false, kind: spotKind(parking, bi, i, count) })
    }
  })
  setTakenCount(spots, Math.round(spots.length * parking.occupancy), seededRandom(parking.id))
  return spots
}

// Точно n места да бидат зафатени (по случаен редослед). Не ги допира резервираните.
export function setTakenCount(spots, n, rand = Math.random, reserved = new Set()) {
  const pool = spots.filter((s) => !reserved.has(s.id))
  pool.forEach((s) => { s.taken = false })
  const order = pool.map((_, i) => i).sort(() => rand() - 0.5)
  order.slice(0, Math.min(n, pool.length)).forEach((i) => { pool[i].taken = true })
}

export const spotsInBlock = (spots, blockName) => spots.filter((s) => s.block === blockName)

// Состојба на место за приказ: mine / taken / selected / free
export function spotState(spot, { mySpotIds, reservedIds, selectedSpot }) {
  if (mySpotIds.has(spot.id)) return 'mine'
  if (spot.taken || reservedIds.has(spot.id)) return 'taken'
  if (selectedSpot === spot.id) return 'selected'
  return 'free'
}

export function spotLabel(spot, state) {
  if (state === 'taken') return '🚗'
  if (state === 'mine') return '★'
  if (spot.kind === 'accessible') return '♿'
  if (spot.kind === 'ev') return '⚡'
  return spot.id.split('-')[1]
}
