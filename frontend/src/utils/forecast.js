/*
  Статистичка проценка на зафатеност по час (наш модел, не AI).

  1) Дневен профил: просечна зафатеност за секој час (0–23) за типот паркинг
     (центар / болница / рекреација / станбено). Во вистинска верзија ова е просекот
     од историските мерења по „ден во неделата × час“. Сега профилите се симулирани.
  2) Викенд-фактор и „личен“ фактор на паркингот (некои се секогаш полни).
  3) Корекција со сегашната состојба: ако сега паркингот е пополн/попразен од просекот,
     таа разлика (резидуал) ја додаваме и во иднина, но таа избледува експоненцијално:
         p(t + h) = профил(t + h) + (сега − профил(сега)) · e^(−h / τ),   τ = 2 ч
     т.е. за блиските часови веруваме повеќе на сегашноста, за подалечните — на просекот.
  4) Несигурност: колку подалеку гледаме, толку е поголема грешката:
         σ(h) = σ∞ · √(1 − e^(−2h / τ))
*/
const PROFILES = {
  //        0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20   21   22   23
  center:      [.20, .15, .10, .10, .10, .15, .25, .45, .70, .80, .85, .85, .85, .85, .80, .80, .85, .92, .95, .90, .80, .60, .45, .30],
  hospital:    [.30, .25, .20, .20, .20, .30, .60, .95, 1.0, 1.0, 1.0, 1.0, .95, .90, .80, .70, .55, .45, .40, .35, .30, .30, .30, .30],
  leisure:     [.05, .05, .05, .05, .05, .05, .10, .15, .25, .35, .50, .60, .65, .70, .75, .80, .85, .80, .70, .55, .40, .25, .15, .10],
  residential: [.80, .80, .80, .80, .80, .75, .65, .50, .40, .35, .35, .35, .40, .40, .45, .50, .60, .70, .80, .85, .85, .85, .85, .80],
}
const WEEKEND = { center: 0.9, hospital: 0.5, leisure: 1.25, residential: 1.05 }
const TAU_H = 2          // за колку часа избледува влијанието на сегашната состојба
const SIGMA_MAX = 0.12   // најголема очекувана грешка (12% од капацитетот)

const clamp01 = (x) => Math.min(1, Math.max(0, x))

// Само историскиот просек за даден момент (0..1), без сегашната состојба
export function profileOccupancy(parking, date) {
  const profile = PROFILES[parking.category] || PROFILES.center
  const h = date.getHours()
  const m = date.getMinutes() / 60
  const base = profile[h] * (1 - m) + profile[(h + 1) % 24] * m // мазен премин меѓу часовите
  const day = date.getDay()
  const factor = day === 0 || day === 6 ? WEEKEND[parking.category] : 1
  const personal = 0.6 + 0.5 * parking.occupancy // паркинзите што се почесто полни имаат повисок профил
  return clamp01(base * factor * personal)
}

/*
  Проценка за даден момент (0..1).
  current = сегашна зафатеност (0..1) ако ја знаеме, now = од кога ја гледаме.
*/
export function predictOccupancy(parking, date, current = null, now = new Date()) {
  const avg = profileOccupancy(parking, date)
  if (current == null) return avg
  const h = Math.max(0, (date - now) / 3_600_000)
  const residual = current - profileOccupancy(parking, now)
  return clamp01(avg + residual * Math.exp(-h / TAU_H))
}

// Колку места може да згрешиме за h часа однапред
export const errorSpots = (total, h) => Math.round(total * SIGMA_MAX * Math.sqrt(1 - Math.exp((-2 * h) / TAU_H)))

// Сегашна зафатеност од бројот на слободни места
export const currentOccupancy = (free, total) => (total ? 1 - Math.max(0, free) / total : null)

// Прогноза за следните N часа: [{ hour: 14, date, occupancy: 0.72, free: 10, error: 3 }, ...]
export function forecast(parking, total, hours = 12, { free = null, from = new Date() } = {}) {
  const current = free == null ? null : currentOccupancy(free, total)
  const out = []
  for (let i = 0; i < hours; i++) {
    const d = new Date(from)
    if (i > 0) { d.setMinutes(0, 0, 0); d.setHours(d.getHours() + i) }
    const occ = i === 0 && current != null ? current : predictOccupancy(parking, d, current, from)
    const h = (d - from) / 3_600_000
    out.push({ hour: d.getHours(), date: d, occupancy: occ, free: Math.round(total * (1 - occ)), error: errorSpots(total, h) })
  }
  return out
}

// Најдобар час (најмалку зафатен) во прогнозата — само дневни часови (7–22), ноќта не е корисен совет
export function bestSlot(fc) {
  const day = fc.filter((s) => s.hour >= 7 && s.hour <= 22)
  const list = day.length ? day : fc
  return list.reduce((best, s) => (s.occupancy < best.occupancy ? s : best), list[0])
}
