const GARAGE = 'Катна гаража'

// Филтри што се додаваат еден по еден. Од групата `type` може да е вклучен само еден.
export const FILTERS = [
  { id: 'all', label: 'Сите', group: 'type' },
  { id: 'garage', label: 'Гаражи', group: 'type' },
  { id: 'open', label: 'Отворени', group: 'type' },
  { id: 'onlyFree', label: 'Има место' },
  { id: 'accessible', label: 'Инвалидско место' },
  { id: 'ev', label: 'Полнач' },
]
export const FILTERS_BY_ID = Object.fromEntries(FILTERS.map((f) => [f.id, f]))

// Вклучените филтри се листа од id-ја, по редот како се додадени
export const DEFAULT_FILTERS = []

export function addFilter(filters, id) {
  const { group } = FILTERS_BY_ID[id]
  const rest = group ? filters.filter((x) => FILTERS_BY_ID[x].group !== group) : filters
  return [...rest, id]
}

export function matchesFilters(parking, stat, filters) {
  const on = (id) => filters.includes(id)
  if (on('garage') && parking.type !== GARAGE) return false
  if (on('open') && parking.type === GARAGE) return false
  if (on('onlyFree') && stat.free <= 0) return false
  if (on('accessible') && stat.freeAccessible <= 0) return false
  if (on('ev') && stat.freeEv <= 0) return false
  return true
}

export const applyFilters = (parkings, stats, filters) => parkings.filter((p) => matchesFilters(p, stats[p.id], filters))
