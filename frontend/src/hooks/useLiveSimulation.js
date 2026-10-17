import { useEffect, useState } from 'react'
import { buildSpots } from '../utils/spots.js'
import { freeSpot, simulateStep } from '../utils/simulation.js'

const TICK_MS = 5000
const byId = (parkings, fn) => Object.fromEntries(parkings.map((p) => [p.id, fn(p)]))

// Местата на секој паркинг + симулација „во живо“ (на секои 5 сек коли влегуваат/излегуваат)
export function useLiveSimulation(parkings, reservedByParking) {
  const [live, setLive] = useState(true)
  const [spotsById, setSpotsById] = useState(() => byId(parkings, buildSpots))
  // „целен“ процент зафатеност кон кој се движи симулацијата
  const [targets] = useState(() => byId(parkings, (p) => p.occupancy))

  useEffect(() => {
    if (!live) return
    const t = setInterval(() => setSpotsById((prev) => simulateStep(prev, parkings, reservedByParking, targets)), TICK_MS)
    return () => clearInterval(t)
  }, [live, parkings, reservedByParking, targets])

  const toggleLive = () => setLive((l) => !l)

  const releaseSpot = (parkingId, spotId) =>
    setSpotsById((prev) => ({ ...prev, [parkingId]: freeSpot(prev[parkingId], spotId) }))

  return { live, toggleLive, spotsById, releaseSpot }
}
