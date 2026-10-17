import { useState } from 'react'
import { getMyLocation } from '../utils/geo.js'

// Од каде бараме паркинг: твојата локација
export function useOrigin() {
  const [origin, setOrigin] = useState(null)
  const [locating, setLocating] = useState(false)

  // fallback: центарот на избраниот град, ако не дозволиш локација
  const locate = async (fallback) => {
    setLocating(true)
    const me = await getMyLocation(fallback)
    setLocating(false)
    const o = { ...me, mine: !me.fallback }
    setOrigin(o)
    return o
  }

  return { origin, setOrigin, locating, locate }
}
