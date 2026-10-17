/*
  Резервации — два режими:
  - 'server': FastAPI backend-от (папка backend/) е вклучен → сите корисници гледаат исти резервации
  - 'local' : backend-от не е вклучен → резервациите се чуваат во прелистувачот (демо режим)
  Апликацијата сама проверува кој режим да го користи (detectMode).
*/
export const GRACE_MIN = 15 // ако не пристигнеш за 15 мин, резервацијата истекува
const KEY = 'tvojparking.reservations'

export async function detectMode() {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 1500)
    const r = await fetch('/api/health', { signal: ctrl.signal })
    clearTimeout(t)
    if (r.ok && (await r.json()).status === 'ok') return 'server'
  } catch { /* нема backend */ }
  return 'local'
}

// Дали резервацијата е уште активна
export function isActive(r, now = Date.now()) {
  if (r.until <= now) return false
  if (!r.checkedIn && r.createdAt + GRACE_MIN * 60_000 <= now) return false
  return true
}

// ---------- локален режим ----------
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* приватен прозорец */ } }

const local = {
  async list() {
    const list = read().filter((r) => isActive(r))
    write(list)
    return list
  },
  async create({ parkingId, spotId, plate, user, hours }) {
    const list = await local.list()
    if (list.some((r) => r.parkingId === parkingId && r.spotId === spotId)) throw new Error('Местото е веќе резервирано.')
    const now = Date.now()
    const r = { id: crypto.randomUUID(), parkingId, spotId, plate, user, hours, createdAt: now, until: now + hours * 3600_000, checkedIn: false }
    write([...list, r])
    return r
  },
  async checkIn(id) { write(read().map((r) => (r.id === id ? { ...r, checkedIn: true } : r))) },
  async cancel(id) { write(read().filter((r) => r.id !== id)) },
}

// ---------- server режим ----------
async function call(path, opts = {}) {
  const r = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!r.ok) {
    let msg = 'Грешка од серверот.'
    try { msg = (await r.json()).detail || msg } catch { /* празно */ }
    throw new Error(msg)
  }
  return r.status === 204 ? null : r.json()
}
const server = {
  list: () => call('/api/reservations'),
  create: (data) => call('/api/reservations', { method: 'POST', body: JSON.stringify(data) }),
  checkIn: (id) => call(`/api/reservations/${id}/checkin`, { method: 'POST' }),
  cancel: (id) => call(`/api/reservations/${id}`, { method: 'DELETE' }),
}

export const getApi = (mode) => (mode === 'server' ? server : local)
