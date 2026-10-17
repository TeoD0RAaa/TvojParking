import { nearestParking } from '../geo.js'
import { currentOccupancy, predictOccupancy } from '../forecast.js'
import { pad2 } from '../format.js'

const HOURS_AHEAD = 16

// Следните часови, без ноќта (07–22) — ноќните часови не се корисен совет
function upcomingDayHours(parking, now, current) {
  return Array.from({ length: HOURS_AHEAD }, (_, i) => {
    const d = new Date(now); d.setMinutes(0, 0, 0); d.setHours(d.getHours() + i)
    return { d, occ: predictOccupancy(parking, d, current, now) }
  }).filter((h) => h.d.getHours() >= 7 && h.d.getHours() <= 22)
}

// „Кога?“ прашања: најблискиот паркинг до местото (дури и ако сега е полн) и најмирниот час
export function answerWhen({ from, parkings, stats, now }) {
  const target = from ? nearestParking(from, parkings) : parkings[0]
  const cur = currentOccupancy(stats[target.id].free, stats[target.id].total)
  const best = upcomingDayHours(target, now, cur).reduce((a, b) => (b.occ < a.occ ? b : a))
  const freeNow = Math.max(0, stats[target.id].free)
  return {
    text: `Кај ${target.name} сега има ${freeNow} слободни места. Најмалку гужва предвидувам околу ${pad2(best.d.getHours())}:00 (~${Math.round(best.occ * 100)}% зафатено).`,
    picks: [target.id],
  }
}
