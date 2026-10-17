// Локален (демо) режим: резервациите се чуваат во прелистувачот
import { isActive } from './reservation.js'

const KEY = 'tvojparking.reservations'
const HOUR = 3600_000

const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* приватен прозорец */ } }

export const localApi = {
  async list() {
    const list = read().filter((r) => isActive(r))
    write(list)
    return list
  },
  async create({ parkingId, spotId, plate, user, hours }) {
    const list = await localApi.list()
    if (list.some((r) => r.parkingId === parkingId && r.spotId === spotId)) throw new Error('Местото е веќе резервирано.')
    const now = Date.now()
    const r = { id: crypto.randomUUID(), parkingId, spotId, plate, user, hours, createdAt: now, until: now + hours * HOUR, checkedIn: false }
    write([...list, r])
    return r
  },
  async checkIn(id) { write(read().map((r) => (r.id === id ? { ...r, checkedIn: true } : r))) },
  async cancel(id) { write(read().filter((r) => r.id !== id)) },
}
