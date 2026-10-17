export const GRACE_MIN = 15 // ако не пристигнеш за 15 мин, резервацијата истекува
const MINUTE = 60_000

// Дали резервацијата е уште активна
export function isActive(r, now = Date.now()) {
  if (r.until <= now) return false
  if (!r.checkedIn && r.createdAt + GRACE_MIN * MINUTE <= now) return false
  return true
}

// Колку минути имаш уште да пристигнеш
export function graceMinutesLeft(r, now) {
  const deadline = r.createdAt + GRACE_MIN * MINUTE
  return Math.min(GRACE_MIN, Math.max(0, Math.ceil((deadline - now) / MINUTE)))
}

// На серверот се гледаат сите резервации — „мои“ се оние со твоето име
export const mineOnly = (active, mode, profile) =>
  mode === 'server' ? active.filter((r) => r.user === profile?.name) : active

// Податоците што оди во QR кодот
export const qrPayload = (r) => JSON.stringify({ id: r.id, parking: r.parkingId, spot: r.spotId, plate: r.plate })
