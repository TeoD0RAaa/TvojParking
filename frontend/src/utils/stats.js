import { distanceKm } from './geo.js'

// { parkingId: Set(резервирани места) } од активните резервации
export function reservedSpotsByParking(active) {
  const m = {}
  for (const r of active) (m[r.parkingId] ||= new Set()).add(r.spotId)
  return m
}

// Слободни места на секој паркинг (вкупно, ♿ и ⚡), без зафатените и резервираните
export function buildStats(parkings, spotsById, reservedByParking) {
  const out = {}
  for (const p of parkings) {
    const reserved = reservedByParking[p.id] || new Set()
    const freeSpots = spotsById[p.id].filter((s) => !s.taken && !reserved.has(s.id))
    out[p.id] = {
      total: spotsById[p.id].length,
      free: freeSpots.length,
      freeAccessible: freeSpots.filter((s) => s.kind === 'accessible').length,
      freeEv: freeSpots.filter((s) => s.kind === 'ev').length,
    }
  }
  return out
}

export const totalFree = (parkings, stats) => parkings.reduce((sum, p) => sum + Math.max(0, stats[p.id].free), 0)

// За листата: по растојание ако знаеме каде одиш, инаку по слободни места
export function sortForList(parkings, stats, origin) {
  const withDist = parkings.map((p) => ({ p, km: origin ? distanceKm(origin, p) : null }))
  return withDist.sort((a, b) => (origin ? a.km - b.km : stats[b.p.id].free - stats[a.p.id].free))
}
