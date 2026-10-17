import { useState } from 'react'
import { getMyLocation } from '../utils/geo.js'

// Од каде бараме паркинг: твојата локација
export function useOrigin() {
  const [origin, setOrigin] = useState(null)
  const [locating, setLocating] = useState(false)

  const locate = async () => {
    setLocating(true)
    const me = await getMyLocation()
    setLocating(false)
    const o = { ...me, mine: !me.fallback }
    setOrigin(o)
    return o
  }

  return { origin, setOrigin, locating, locate }
}
