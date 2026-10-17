import { pickRandom } from './random.js'

const CARS_PER_TICK = 3
const TOLERANCE = 0.03

// Една кола влегува или излегува, со движење кон целниот процент зафатеност.
// Колите се паркираат ПО РЕД: нова кола -> првото слободно место; излегува -> последното зафатено.
// ♿ местата не ги менува (тие се посебни).
function moveOneCar(current, reserved, target) {
  const spots = current.map((s) => ({ ...s }))
  const pool = spots.filter((s) => !reserved.has(s.id) && s.kind !== 'accessible')
  if (!pool.length) return spots
  const ratio = pool.filter((s) => s.taken).length / pool.length
  const wantMoreCars = ratio < target - TOLERANCE ? true : ratio > target + TOLERANCE ? false : Math.random() < 0.5
  const spot = wantMoreCars ? pool.find((s) => !s.taken) : pool.findLast((s) => s.taken)
  if (spot) spot.taken = wantMoreCars
  return spots
}

// Еден чекор од симулацијата „во живо“ на неколку случајни паркинзи
export function simulateStep(spotsById, parkings, reservedByParking, targets) {
  const next = { ...spotsById }
  for (let k = 0; k < CARS_PER_TICK; k++) {
    const p = pickRandom(parkings)
    next[p.id] = moveOneCar(next[p.id], reservedByParking[p.id] || new Set(), targets[p.id])
  }
  return next
}

// Местото е твое: симулацијата не смее да стави кола таму
export const freeSpot = (spots, spotId) => spots.map((s) => (s.id === spotId ? { ...s, taken: false } : s))
