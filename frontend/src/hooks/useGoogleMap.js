import { useEffect, useState } from 'react'
import { loadGoogleMaps } from '../utils/googleMaps.js'
import { MAP_OPTIONS } from '../utils/mapConfig.js'

// Ја прави Google мапата во дадениот контејнер (еднаш)
export function useGoogleMap(containerRef) {
  const [state, setState] = useState({ google: null, map: null, error: null })

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then((google) => {
        if (cancelled) return
        const map = new google.maps.Map(containerRef.current, MAP_OPTIONS)
        setState({ google, map, error: null })
      })
      .catch((e) => !cancelled && setState((s) => ({ ...s, error: e.message })))
    return () => { cancelled = true }
  }, [containerRef])

  return state
}
