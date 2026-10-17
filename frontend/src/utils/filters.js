const GARAGE = 'Катна гаража'
const CHEAP_MAX = 40

export const DEFAULT_FILTERS = { type: 'all', onlyFree: false, cheap: false, accessible: false, ev: false }

export function matchesFilters(parking, stat, filters) {
  if (filters.type === 'garage' && parking.type !== GARAGE) return false
  if (filters.type === 'open' && parking.type === GARAGE) return false
  if (filters.onlyFree && stat.free <= 0) return false
  if (filters.cheap && parking.pricePerHour > CHEAP_MAX) return false
  if (filters.accessible && stat.freeAccessible <= 0) return false
  if (filters.ev && stat.freeEv <= 0) return false
  return true
}

export const applyFilters = (parkings, stats, filters) => parkings.filter((p) => matchesFilters(p, stats[p.id], filters))
