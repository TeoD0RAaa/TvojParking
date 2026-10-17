/*
  Предвидување на зафатеност по час.
  Секоја категорија паркинг има „дневен профил“: колкав дел е зафатен во секој час (0..23).
  Профилите се проценка (симулирани податоци). Во вистинска верзија би се учеле од
  историските податоци од сензорите (на пр. просек по ден во неделата и час).
*/
const PROFILES = {
  //        0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23
  center:      [.20, .15, .10, .10, .10, .15, .25, .45, .70, .80, .85, .85, .85, .85, .80, .80, .85, .92, .95, .90, .80, .60, .45, .30],
  hospital:    [.30, .25, .20, .20, .20, .30, .60, .95, 1.0, 1.0, 1.0, 1.0, .95, .90, .80, .70, .55, .45, .40, .35, .30, .30, .30, .30],
  leisure:     [.05, .05, .05, .05, .05, .05, .10, .15, .25, .35, .50, .60, .65, .70, .75, .80, .85, .80, .70, .55, .40, .25, .15, .10],
  residential: [.80, .80, .80, .80, .80, .75, .65, .50, .40, .35, .35, .35, .40, .40, .45, .50, .60, .70, .80, .85, .85, .85, .85, .80],
}
const WEEKEND = { center: 0.9, hospital: 0.5, leisure: 1.25, residential: 1.05 }

// Колкав дел ќе биде зафатен во даден момент (0..1)
export function predictOccupancy(parking, date) {
  const profile = PROFILES[parking.category] || PROFILES.center
  const h = date.getHours()
  const m = date.getMinutes() / 60
  const base = profile[h] * (1 - m) + profile[(h + 1) % 24] * m // мазен премин меѓу часовите
  const day = date.getDay()
  const factor = day === 0 || day === 6 ? WEEKEND[parking.category] : 1
  // „личноста“ на паркингот: оние што се почесто полни имаат повисок профил
  const personal = 0.6 + 0.5 * parking.occupancy
  return Math.min(1, base * factor * personal)
}

// Прогноза за следните N часа: [{ hour: 14, date, occupancy: 0.72, free: 10 }, ...]
export function forecast(parking, total, hours = 12, from = new Date()) {
  const out = []
  for (let i = 0; i < hours; i++) {
    const d = new Date(from)
    d.setMinutes(0, 0, 0)
    d.setHours(d.getHours() + i)
    const occ = predictOccupancy(parking, d)
    out.push({ hour: d.getHours(), date: d, occupancy: occ, free: Math.round(total * (1 - occ)) })
  }
  return out
}

// Најдобар час (најмалку зафатен) во прогнозата — само дневни часови (7–22), ноќта не е корисен совет
export function bestSlot(fc) {
  const day = fc.filter((s) => s.hour >= 7 && s.hour <= 22)
  const list = day.length ? day : fc
  return list.reduce((best, s) => (s.occupancy < best.occupancy ? s : best), list[0])
}
