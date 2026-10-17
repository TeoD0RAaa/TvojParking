import { useEffect, useRef } from 'react'
import { createOverlayClass, ORIGIN_HTML } from '../utils/mapOverlays.js'

// Сина точка на мапата за твојата локација / местото каде одиш
export function useOriginMarker({ google, map, origin }) {
  const markerRef = useRef(null)

  useEffect(() => {
    if (!map) return
    if (!origin) { markerRef.current?.setMap(null); return }
    if (!markerRef.current) {
      markerRef.current = new (createOverlayClass(google))(origin)
      markerRef.current.setContent(ORIGIN_HTML, 2000)
    }
    markerRef.current.setPosition(origin)
    if (!markerRef.current.getMap()) markerRef.current.setMap(map)
  }, [google, map, origin])

  useEffect(() => () => markerRef.current?.setMap(null), [])
}
