import { useEffect, useState } from 'react'
import { getMyLocation } from '../utils/geo.js'
import { travelTime } from '../utils/travelTime.js'
import { CITIES_BY_ID } from '../data/cities.js'

/*
  Колку ти треба со кола од твојата локација до паркингот (се пресметува кога ќе избереш место).
  Враќа null додека пресметува, потоа { driveMin, graceMin, source, from }.
*/
export function useTravelTime(parking, enabled) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!enabled || result) return
    let cancelled = false
    ;(async () => {
      const city = CITIES_BY_ID[parking.city]
      const from = await getMyLocation(city) // ако одбиеш локација -> од центарот на градот
      const t = await travelTime(from, parking)
      if (!cancelled) setResult({ ...t, from })
    })()
    return () => { cancelled = true }
  }, [enabled, parking, result])

  return result
}
