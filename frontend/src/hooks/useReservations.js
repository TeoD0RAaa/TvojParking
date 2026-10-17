import { useCallback, useEffect, useMemo, useState } from 'react'
import { getApi, isActive, mineOnly } from '../utils/api/index.js'
import { reservedSpotsByParking } from '../utils/stats.js'

const POLL_MS = 5000

// Резервации: Firebase ги праќа промените во живо, а од серверот се освежуваат на секои 5 сек
export function useReservations(mode, profile, now) {
  const [reservations, setReservations] = useState([])
  const api = getApi(mode)

  const refresh = useCallback(() => getApi(mode).list().then(setReservations).catch(() => {}), [mode])
  useEffect(() => {
    const live = getApi(mode).subscribe
    if (live) return live(setReservations, () => {}) // Firebase: во живо, без чекање
    refresh()
    if (mode !== 'server') return
    const t = setInterval(refresh, POLL_MS)
    return () => clearInterval(t)
  }, [mode, refresh])

  const active = useMemo(() => reservations.filter((r) => isActive(r, now)), [reservations, now])
  const mine = useMemo(() => mineOnly(active, mode, profile), [active, mode, profile])
  const reservedByParking = useMemo(() => reservedSpotsByParking(active), [active])

  const create = async (data) => { await api.create(data); await refresh() }
  const checkIn = async (id) => { await api.checkIn(id); await refresh() }
  const cancel = async (id) => { await api.cancel(id); await refresh() }

  return { mine, reservedByParking, create, checkIn, cancel }
}
