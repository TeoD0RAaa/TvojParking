/*
  Асистент со Gemini.
  - Ако во frontend/.env.local има VITE_GEMINI_API_KEY -> прелистувачот директно го прашува Gemini
    (не треба backend).
  - Инаку, ако backend-от е вклучен -> преку /api/assistant (клучот е во backend/.env).
  На Gemini му праќаме СЕГАШНА состојба: слободни места, цени, растојанија и нашата статистичка
  проценка за следните часови, за да одговара со вистински бројки од апликацијата.
*/
import { LANDMARKS } from '../../data/landmarks.js'
import { distanceKm } from '../geo.js'
import { forecast } from '../forecast.js'
import { pad2 } from '../format.js'

const FORECAST_HOURS = 6
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
// ако првиот модел не одговори, пробува со следниот
const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash']

export const hasDirectKey = Boolean(API_KEY)

const SYSTEM_PROMPT = `Ти си асистентот на апликацијата TvojParking за паркинзи во Скопје.
Зборуваш на македонски (ако корисникот пишува на латиница или англиски, одговори на истиот јазик),
кратко и пријателски: 1–3 реченици.

Во секое барање добиваш JSON „context“ со СЕГАШНАТА состојба:
- parkings: секој паркинг со id, име, тип, адреса, цена (ден/час), слободни/вкупно места,
  слободни ♿ и ⚡ места, растојание од корисникот (km, ако е познато) и
  forecast = наша статистичка проценка на слободни места за следните часови.
- landmarks: познати места во Скопје со координати.
- origin: каде е корисникот (ако е познато), now: сегашно време.

Правила:
- Ако корисникот само поздравува или муабети, одговори пријателски и прашај каде оди; picks = [].
- Користи САМО податоците од context. Не измислувај паркинзи, цени или бројки.
- Ако корисникот спомене место (на пр. Кале, плоштад), избери паркинзи близу тоа место според координатите.
- Ако паркинг има 0 слободни места, не го препорачувај за паркирање сега (освен ако прашува „кога“).
- За „кога е најмалку гужва“ користи го forecast.
- Ако корисникот каже колку часа, пресметај ја цената (часови × цена).
- Места не се бираат: при резервација автоматски се добива следното слободно место по ред.
- picks: до 3 id-а на паркинзи што ги препорачуваш (најдобриот прв), или празна листа.
- hours: колку часа сака да паркира, ако го кажал; инаку null.`

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    text: { type: 'STRING' },
    picks: { type: 'ARRAY', items: { type: 'STRING' } },
    hours: { type: 'INTEGER', nullable: true },
  },
  required: ['text', 'picks'],
}

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

const toHistory = (history) => history.map((m) => ({ role: m.from === 'me' ? 'user' : 'model', text: m.text }))

// Директно до Gemini од прелистувачот
async function askDirect(message, history, context) {
  const contents = toHistory(history).slice(-10).map((t) => ({ role: t.role, parts: [{ text: t.text }] }))
  contents.push({ role: 'user', parts: [{ text: `context:\n${JSON.stringify(context)}\n\nПрашање: ${message}` }] })
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA },
  })

  let data = null
  let lastError = 'непозната грешка'
  for (const model of MODELS) {
    const r = await fetch(API_URL(model), { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY }, body })
    if (r.ok) { data = await r.json(); break }
    lastError = `${r.status}`
    if (r.status === 400 || r.status === 404) continue // моделот не постои -> следен
    if (r.status === 401 || r.status === 403) throw new Error('Gemini го одби API клучот')
    if (r.status === 429) throw new Error('премногу прашања, пробај пак за малку')
    throw new Error(`грешка од Gemini (${r.status})`)
  }
  if (!data) throw new Error(`ниту еден модел не одговори (${lastError})`)

  const out = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}')
  const valid = new Set(context.parkings.map((p) => p.id))
  const hours = Number.isInteger(out.hours) && out.hours >= 1 && out.hours <= 12 ? out.hours : null
  return { text: String(out.text || '').trim(), picks: (out.picks || []).filter((id) => valid.has(id)).slice(0, 3), hours }
}

// Преку backend-от (клучот е во backend/.env)
async function askBackend(message, history, context) {
  const r = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: toHistory(history), context }),
  })
  if (!r.ok) {
    let msg = 'Асистентот не одговори.'
    try { msg = (await r.json()).detail || msg } catch { /* празно */ }
    throw new Error(msg)
  }
  return r.json()
}

// history: [{ from: 'me' | 'bot', text }] -> { text, picks, hours }
export function askGemini(message, history, ctx) {
  const context = buildContext(ctx)
  return hasDirectKey ? askDirect(message, history, context) : askBackend(message, history, context)
}
