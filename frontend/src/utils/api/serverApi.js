// Server режим: FastAPI backend-от (папка backend/), сите корисници гледаат исти резервации
async function call(path, opts = {}) {
  const r = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!r.ok) {
    let msg = 'Грешка од серверот.'
    try { msg = (await r.json()).detail || msg } catch { /* празно */ }
    throw new Error(msg)
  }
  return r.status === 204 ? null : r.json()
}

export const serverApi = {
  list: () => call('/api/reservations'),
  create: (data) => call('/api/reservations', { method: 'POST', body: JSON.stringify(data) }),
  checkIn: (id) => call(`/api/reservations/${id}/checkin`, { method: 'POST' }),
  cancel: (id) => call(`/api/reservations/${id}`, { method: 'DELETE' }),
}

// Дали backend-от е вклучен (чека најмногу 1.5 сек)
export async function isServerUp() {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 1500)
    const r = await fetch('/api/health', { signal: ctrl.signal })
    clearTimeout(t)
    return r.ok && (await r.json()).status === 'ok'
  } catch { return false }
}
