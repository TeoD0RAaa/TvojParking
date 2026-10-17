import { seededRandom } from './random.js'

const BLOCK_LETTERS = 'АБВГДЃЕ'

// Ги прави сите места на паркингот: [{ id: 'А-07', block: 'Блок А', taken: true }, ...]
export function buildSpots(parking) {
  const spots = parking.blocks.flatMap((b, bi) =>
    Array.from({ length: b.rows * b.perRow }, (_, i) => ({
      id: `${BLOCK_LETTERS[bi]}-${String(i + 1).padStart(2, '0')}`,
      block: b.name,
      taken: false,
    }))
  )
  markTaken(spots, parking)
  return spots
}

// Зафати точно occupancy * вкупно места, по случаен редослед
function markTaken(spots, parking) {
  const rand = seededRandom(parking.id)
  const order = spots.map((_, i) => i).sort(() => rand() - 0.5)
  const takenCount = Math.round(spots.length * parking.occupancy)
  order.slice(0, takenCount).forEach((i) => { spots[i].taken = true })
}

export const spotsInBlock = (spots, blockName) => spots.filter((s) => s.block === blockName)

// Слободни места, без зафатените и без твоите резервации
export const freeSpotCount = (spots, mySpotIds) => spots.filter((s) => !s.taken && !mySpotIds.has(s.id)).length

// Состојба на место за приказ: mine / taken / selected / free
export function spotState(spot, mySpotIds, selectedSpot) {
  if (mySpotIds.has(spot.id)) return 'mine'
  if (spot.taken) return 'taken'
  if (selectedSpot === spot.id) return 'selected'
  return 'free'
}

export function spotLabel(spot, state) {
  if (state === 'taken') return '🚗'
  if (state === 'mine') return '★'
  return spot.id.split('-')[1]
}
