export const GRACE_MIN = 15 // стандардно, ако резервацијата нема свое време (на пр. стари резервации)
const MINUTE = 60_000

// Колку минути имаше за да пристигнеш (зависи од тоа колку си бил далеку)
export const graceOf = (r) => r.graceMin ?? GRACE_MIN

// Дали резервацијата е уште активна
export function isActive(r, now = Date.now()) {
  if (r.until <= now) return false
  if (!r.checkedIn && r.createdAt + graceOf(r) * MINUTE <= now) return false
  return true
}

// Колку минути имаш уште да пристигнеш
export function graceMinutesLeft(r, now) {
  const deadline = r.createdAt + graceOf(r) * MINUTE
  return Math.min(graceOf(r), Math.max(0, Math.ceil((deadline - now) / MINUTE)))
}

// На серверот се гледаат сите резервации — „мои“ се оние со твоето име
export const mineOnly = (active, mode, profile) =>
  mode === 'server' ? active.filter((r) => r.user === profile?.name) : active

// Податоците што оди во QR кодот
export const qrPayload = (r) => JSON.stringify({ id: r.id, parking: r.parkingId, spot: r.spotId, plate: r.plate })
