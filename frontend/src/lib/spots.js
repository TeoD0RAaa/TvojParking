// Мал генератор на „случајни“ броеви што секогаш дава ист резултат за ист паркинг,
// за да не се менуваат зафатените места при секое освежување на страната.
function seededRandom(seedText) {
  let h = 2166136261
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

// Ги прави сите места на паркингот: [{ id: 'А-07', block: 'Блок А', taken: true }, ...]
export function buildSpots(parking) {
  const spots = []
  parking.blocks.forEach((b, bi) => {
    const letter = 'АБВГДЃЕ'[bi]
    for (let i = 1; i <= b.rows * b.perRow; i++) {
      spots.push({ id: `${letter}-${String(i).padStart(2, '0')}`, block: b.name, taken: false })
    }
  })
  // зафати точно occupancy * вкупно места, по случаен редослед
  const rand = seededRandom(parking.id)
  const order = spots.map((_, i) => i).sort(() => rand() - 0.5)
  const takenCount = Math.round(spots.length * parking.occupancy)
  order.slice(0, takenCount).forEach((i) => { spots[i].taken = true })
  return spots
}

// Статус на паркинг според процентот слободни места
export function availability(free, total) {
  if (free === 0) return { level: 'full', label: 'Полн', color: 'var(--red)' }
  if (free / total < 0.3) return { level: 'few', label: 'Малку места', color: 'var(--yellow)' }
  return { level: 'many', label: 'Има места', color: 'var(--green)' }
}
