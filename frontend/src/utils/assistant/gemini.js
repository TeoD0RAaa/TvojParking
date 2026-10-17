/*
  Асистент со Gemini — преку нашиот backend (/api/assistant), за API клучот да не е во прелистувачот.
  Му праќаме на моделот СЕГАШНА состојба: слободни места, цени, растојанија и нашата статистичка
  проценка за следните часови, за да одговара со вистински бројки од апликацијата.
*/
import { LANDMARKS } from '../../data/landmarks.js'
import { distanceKm } from '../geo.js'
import { forecast } from '../forecast.js'
import { pad2 } from '../format.js'

const FORECAST_HOURS = 6

export function buildContext({ parkings, stats, origin, now = new Date() }) {
  return {
    now: now.toLocaleString('mk-MK', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
    origin: origin ? { name: origin.name, lat: origin.lat, lng: origin.lng } : null,
    landmarks: LANDMARKS.map(({ name, lat, lng }) => ({ name, lat, lng })),
    parkings: parkings.map((p) => {
      const s = stats[p.id]
      return {
        id: p.id, name: p.name, type: p.type, address: p.address, lat: p.lat, lng: p.lng,
        pricePerHour: p.pricePerHour, free: Math.max(0, s.free), total: s.total,
        freeAccessible: s.freeAccessible, freeEv: p.ev ? s.freeEv : 0,
        distanceKm: origin ? Number(distanceKm(origin, p).toFixed(2)) : null,
        forecast: forecast(p, s.total, FORECAST_HOURS, { free: s.free, from: now })
          .slice(1).map((f) => `${pad2(f.hour)}:00 ~${f.free}±${f.error} слободни`),
      }
    }),
  }
}

// history: [{ from: 'me' | 'bot', text }]
export async function askGemini(message, history, ctx) {
  const r = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map((m) => ({ role: m.from === 'me' ? 'user' : 'model', text: m.text })),
      context: buildContext(ctx),
    }),
  })
  if (!r.ok) {
    let msg = 'Асистентот не одговори.'
    try { msg = (await r.json()).detail || msg } catch { /* празно */ }
    throw new Error(msg)
  }
  return r.json() // { text, picks, hours }
}
