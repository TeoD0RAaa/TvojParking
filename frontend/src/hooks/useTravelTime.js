import { useEffect, useState } from 'react'
import { getMyLocation } from '../utils/geo.js'
import { travelTime } from '../utils/travelTime.js'

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
      const from = await getMyLocation() // ако одбиеш локација -> од Плоштад
      const t = await travelTime(from, parking)
      if (!cancelled) setResult({ ...t, from })
    })()
    return () => { cancelled = true }
  }, [enabled, parking, result])

  return result
}
