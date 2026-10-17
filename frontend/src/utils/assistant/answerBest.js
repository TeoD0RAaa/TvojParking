import { distanceKm, formatDistance, walkMinutes } from '../geo.js'
import { currentOccupancy, predictOccupancy } from '../forecast.js'

const ARRIVAL_MIN = 20 // проценка за колку време ќе стигнеш

function candidatesFor(q, parkings, stats) {
  let list = parkings.filter((p) => stats[p.id].free > 0)
  if (q.garage) list = list.filter((p) => p.type === 'Катна гаража')
  if (q.ev) list = list.filter((p) => stats[p.id].freeEv > 0)
  if (q.accessible) list = list.filter((p) => stats[p.id].freeAccessible > 0)
  return list
}

/*
  Бодување: помалку бодови = подобро.
  растојание (км × 10) + цена (ако бараш евтино) + казна ако ќе биде гужва кога ќе стигнеш
*/
function score(p, { q, from, stats, now }) {
  const km = from ? distanceKm(from, p) : 0
  const cur = currentOccupancy(stats[p.id].free, stats[p.id].total)
  const busy = predictOccupancy(p, new Date(now.getTime() + ARRIVAL_MIN * 60_000), cur, now)
  const points = km * 10 + (q.cheap ? p.pricePerHour / 5 : 0) + (busy > 0.9 ? 4 : 0) - stats[p.id].free / 20
  return { p, km, busy, score: points }
}

function describe(first, { q, from, stats }) {
  const where = from ? ` до ${from.name}` : ''
  const walk = from ? ` (${formatDistance(first.km)}, ~${walkMinutes(first.km)} мин пешки)` : ''
  const hoursText = q.hours ? ` За ${q.hours} ч ќе платиш ${q.hours * first.p.pricePerHour} ден.` : ''
  const warn = first.busy > 0.85 ? ' Внимание: за 20 мин се очекува да се наполни, резервирај сега.' : ''
  return `Најдобар избор${where}: ${first.p.name}${walk}, ${stats[first.p.id].free} слободни места.${hoursText}${warn}`
}

// Најдобрите 3 паркинзи за прашањето
export function answerBest({ q, from, parkings, stats, now }) {
  const candidates = candidatesFor(q, parkings, stats)
  if (candidates.length === 0) {
    return { text: 'Во моментов нема слободен паркинг што ги исполнува сите услови 😕 Пробај без некој од условите.', picks: [] }
  }
  const ctx = { q, from, stats, now }
  const top = candidates.map((p) => score(p, ctx)).sort((a, b) => a.score - b.score).slice(0, 3)
  return { text: describe(top[0], ctx), picks: top.map((t) => t.p.id), hours: q.hours }
}
