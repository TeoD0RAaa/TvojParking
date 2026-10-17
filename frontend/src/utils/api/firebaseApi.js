// Firebase режим: резервациите се во Firestore → сите корисници ги гледаат истите, во живо
// (и од GitHub Pages, без наш сервер). Правилата за базата се во firestore.rules.
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, runTransaction, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { GRACE_MIN, isActive } from './reservation.js'

const HOUR = 3600_000
const COL = 'reservations'
const col = collection(db, COL)

// Еден документ по место (на пр. „kale__А-07“), па двајца не можат да го резервираат истото место
const spotKey = (parkingId, spotId) => `${parkingId}__${spotId}`
const activeOnly = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => isActive(r))
const clampInt = (v, min, max, fallback) => Math.min(max, Math.max(min, Math.round(Number(v)) || fallback))

// Пораки од Firebase -> разбирливи на македонски
function friendly(err) {
  if (err?.code === 'permission-denied') return new Error('Firebase ја одби резервацијата. Провери ги името и таблицата.')
  if (err?.code === 'unavailable') return new Error('Нема врска со Firebase. Провери го интернетот.')
  return err instanceof Error ? err : new Error('Грешка од Firebase.')
}

export const firebaseApi = {
  async list() {
    return activeOnly(await getDocs(col))
  },

  // Во живо: секоја промена кај било кој корисник веднаш стигнува тука. Враќа функција за откажување.
  subscribe(onChange, onError) {
    return onSnapshot(col, (snap) => onChange(activeOnly(snap)), onError)
  },

  async create({ parkingId, spotId, plate, user, hours, graceMin = GRACE_MIN }) {
    const name = String(user || '').trim()
    const car = String(plate || '').trim().toUpperCase()
    if (name.length < 2) throw new Error('Внеси име (барем 2 букви).')
    if (car.length < 4 || car.length > 15) throw new Error('Внеси ја регистарската таблица.')
    const ref = doc(db, COL, spotKey(parkingId, spotId))
    try {
      return await runTransaction(db, async (tx) => {
        const cur = await tx.get(ref)
        if (cur.exists() && isActive(cur.data())) throw new Error('Ова место штотуку го резервирал некој друг. Избери друго.')
        const now = Date.now()
        const h = clampInt(hours, 1, 12, 1)
        const r = {
          parkingId, spotId, plate: car, user: name.slice(0, 40), hours: h,
          createdAt: now, until: now + h * HOUR, graceMin: clampInt(graceMin, 5, 120, GRACE_MIN), checkedIn: false,
        }
        tx.set(ref, r)
        return { id: ref.id, ...r }
      })
    } catch (err) { throw friendly(err) }
  },

  async checkIn(id) {
    try { await updateDoc(doc(db, COL, id), { checkedIn: true }) } catch (err) { throw friendly(err) }
  },

  async cancel(id) {
    try { await deleteDoc(doc(db, COL, id)) } catch (err) { throw friendly(err) }
  },
}

// Дали Firestore е достапен (базата е создадена и правилата дозволуваат читање)
export async function isFirebaseUp(ms = 4000) {
  let timer
  try {
    await Promise.race([
      getDocs(query(col, limit(1))),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), ms) }),
    ])
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}
