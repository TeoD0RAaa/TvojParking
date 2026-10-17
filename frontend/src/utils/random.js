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

export const pickRandom = (list) => list[Math.floor(Math.random() * list.length)]
