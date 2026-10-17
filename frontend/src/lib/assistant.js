/*
  Асистент за паркинг — разбира прашања како:
    „Каде да паркирам близу Кале за 2 часа?“
    „евтин паркинг до плоштад“, „гаража со полнач“, „kade blisku do mene“
  Ова е асистент со правила (бара клучни зборови) — работи без интернет и без API клуч.
  Подоцна може да се замени со вистински LLM (на пр. Claude API) преку backend-от.
*/
import { LANDMARKS } from '../data/landmarks.js'
import { distanceKm, formatDistance, walkMinutes } from './geo.js'
import { predictOccupancy } from './forecast.js'

const has = (text, words) => words.some((w) => text.includes(w))

export function parseQuestion(raw) {
  const text = raw.toLowerCase()
  const landmark = LANDMARKS.find((l) => has(text, l.aliases)) || null
  const hoursMatch = text.match(/(\d+)\s*(ч|час|саат|h|sat|hour)/)
  return {
    landmark,
    nearMe: has(text, ['близу мене', 'до мене', 'blisku do mene', 'blizu mene', 'near me', 'около мене', 'моја локација']),
    hours: hoursMatch ? Math.min(12, Math.max(1, Number(hoursMatch[1]))) : null,
    cheap: has(text, ['евтин', 'evtin', 'cheap', 'најевтин', 'najevtin']),
    garage: has(text, ['гаража', 'garaza', 'garaža', 'garage', 'покриен', 'pokrien']),
    ev: has(text, ['електр', 'elektr', 'полнач', 'полнење', 'polnac', 'polnenje', ' ev', 'tesla']),
    accessible: has(text, ['попреченост', 'инвалид', 'invalid', 'poprecenost', '♿']),
    when: has(text, ['кога', 'koga', 'when', 'најдобро време', 'najdobro vreme', 'гужва', 'guzva']),
    help: has(text, ['помош', 'pomos', 'help', 'што знаеш', 'sto znaes']) || text.trim().length < 3,
  }
}

/*
  Бодување: помалку бодови = подобро.
  растојание (км × 10) + цена (ако бараш евтино) + казна ако ќе биде гужва кога ќе стигнеш
*/
export function answer(raw, { parkings, stats, origin, now = new Date() }) {
  const q = parseQuestion(raw)
  if (q.help) {
    return { text: 'Прашај ме на пример: „Каде да паркирам близу Кале за 2 часа?“, „евтин паркинг до плоштад“, „гаража со полнач“ или „кога е најмалку гужва кај Клинички?“', picks: [] }
  }
  const from = q.landmark || (q.nearMe ? origin : null) || origin

  // „кога?“ прашања: најблискиот паркинг до местото (дури и ако сега е полн) и најмирниот час
  if (q.when) {
    const target = from
      ? parkings.reduce((a, b) => (distanceKm(from, b) < distanceKm(from, a) ? b : a))
      : parkings[0]
    const hours = Array.from({ length: 16 }, (_, i) => {
      const d = new Date(now); d.setMinutes(0, 0, 0); d.setHours(d.getHours() + i)
      return { d, occ: predictOccupancy(target, d) }
    }).filter((h) => h.d.getHours() >= 7 && h.d.getHours() <= 22) // ноќните часови не се корисен совет
    const best = hours.reduce((a, b) => (b.occ < a.occ ? b : a))
    const freeNow = Math.max(0, stats[target.id].free)
    return {
      text: `Кај ${target.name} сега има ${freeNow} слободни места. Најмалку гужва предвидувам околу ${String(best.d.getHours()).padStart(2, '0')}:00 (~${Math.round(best.occ * 100)}% зафатено).`,
      picks: [target.id],
    }
  }

  let candidates = parkings.filter((p) => stats[p.id].free > 0)
  if (q.garage) candidates = candidates.filter((p) => p.type === 'Катна гаража')
  if (q.ev) candidates = candidates.filter((p) => stats[p.id].freeEv > 0)
  if (q.accessible) candidates = candidates.filter((p) => stats[p.id].freeAccessible > 0)

  if (candidates.length === 0) {
    return { text: 'Во моментов нема слободен паркинг што ги исполнува сите услови 😕 Пробај без некој од условите.', picks: [] }
  }

  const scored = candidates.map((p) => {
    const km = from ? distanceKm(from, p) : 0
    const later = new Date(now.getTime() + 20 * 60_000) // проценка кога ќе стигнеш
    const busy = predictOccupancy(p, later)
    const score = km * 10 + (q.cheap ? p.pricePerHour / 5 : 0) + (busy > 0.9 ? 4 : 0) - stats[p.id].free / 20
    return { p, km, busy, score }
  }).sort((a, b) => a.score - b.score)

  const top = scored.slice(0, 3)
  const first = top[0]
  const where = from ? ` до ${from.name}` : ''
  const hoursText = q.hours ? ` За ${q.hours} ч ќе платиш ${q.hours * first.p.pricePerHour} ден.` : ''
  const walk = from ? ` (${formatDistance(first.km)}, ~${walkMinutes(first.km)} мин пешки)` : ''
  const warn = first.busy > 0.85 ? ' Внимание: за 20 мин се очекува да се наполни, резервирај сега.' : ''
  return {
    text: `Најдобар избор${where}: ${first.p.name}${walk}, ${stats[first.p.id].free} слободни места.${hoursText}${warn}`,
    picks: top.map((t) => t.p.id),
    hours: q.hours,
  }
}
