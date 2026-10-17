// Колку слободни / вкупно има секој паркинг, со твоите резервации одземени
export function buildStats(parkings, spotsById, reservations) {
  const out = {}
  for (const p of parkings) {
    const spots = spotsById[p.id]
    const mine = reservations.filter((r) => r.parkingId === p.id).length
    out[p.id] = { total: spots.length, free: spots.filter((s) => !s.taken).length - mine }
  }
  return out
}

export const totalFree = (parkings, stats) => parkings.reduce((sum, p) => sum + stats[p.id].free, 0)

// Паркинзите со најмногу слободни места први
export const sortByFree = (parkings, stats) => [...parkings].sort((a, b) => stats[b.id].free - stats[a.id].free)
