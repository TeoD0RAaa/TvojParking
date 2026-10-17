// Генератор на „случајни“ броеви што секогаш дава ист резултат за ист текст (семе),
// за да не се менуваат зафатените места при секое освежување на страната.
export function seededRandom(seedText) {
  let h = 2166136261
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

// Ги прави сите места на паркингот:
// [{ id: 'А-07', block: 'Блок А', taken: true, kind: 'normal' | 'accessible' | 'ev' }, ...]
export function buildSpots(parking) {
  const spots = []
  parking.blocks.forEach((b, bi) => {
    const letter = 'АБВГДЃЕ'[bi]
    const count = b.rows * b.perRow
    for (let i = 1; i <= count; i++) {
      let kind = 'normal'
      if (bi === 0 && i <= 2) kind = 'accessible' // првите 2 места во првиот блок се за лица со попреченост
      if (parking.ev && bi === parking.blocks.length - 1 && i > count - 2) kind = 'ev' // последните 2 = полнење
      spots.push({ id: `${letter}-${String(i).padStart(2, '0')}`, block: b.name, taken: false, kind })
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

// Статус на паркинг според процентот слободни места
export function availability(free, total) {
  if (free <= 0) return { level: 'full', label: 'Полн', color: 'var(--red)' }
  if (free / total < 0.3) return { level: 'few', label: 'Малку места', color: 'var(--yellow)' }
  return { level: 'many', label: 'Има места', color: 'var(--green)' }
}

export const KIND_LABEL = { accessible: '♿ за лица со попреченост', ev: '⚡ полнење за електрично возило', normal: 'обично место' }
