import { useEffect, useState } from 'react'
import { loadGoogleMaps } from '../utils/googleMaps.js'
import { mapOptions, mapStyles } from '../utils/mapConfig.js'

// Ја прави Google мапата во дадениот контејнер (еднаш) и ја менува темата
export function useGoogleMap(containerRef, theme) {
  const [state, setState] = useState({ google: null, map: null, error: null })

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then((google) => {
        if (cancelled) return
        const map = new google.maps.Map(containerRef.current, mapOptions(theme))
        setState({ google, map, error: null })
      })
      .catch((e) => !cancelled && setState((s) => ({ ...s, error: e.message })))
    return () => { cancelled = true }
  }, [containerRef]) // eslint-disable-line react-hooks/exhaustive-deps -- темата се менува подолу

  useEffect(() => { state.map?.setOptions({ styles: mapStyles(theme) }) }, [state.map, theme])

  return state
}
