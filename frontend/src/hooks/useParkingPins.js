import { useEffect, useRef } from 'react'
import { createOverlayClass, pinHtml } from '../utils/mapOverlays.js'

// Пин за секој паркинг на мапата. Пиновите се прават еднаш, а филтрите само ги кријат/покажуваат.
export function useParkingPins({ google, map, parkings, stats, selectedId, onSelect }) {
  const pinsRef = useRef({})
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!map) return
    const HtmlOverlay = createOverlayClass(google)
    const visible = new Set(parkings.map((p) => p.id))
    for (const p of parkings) {
      const pin = (pinsRef.current[p.id] ||= new HtmlOverlay({ lat: p.lat, lng: p.lng }, () => onSelectRef.current(p.id)))
      if (!pin.getMap()) pin.setMap(map)
      const active = p.id === selectedId
      pin.setContent(pinHtml(stats[p.id], active), active ? 1000 : 0)
    }
    for (const [id, pin] of Object.entries(pinsRef.current)) {
      if (!visible.has(id)) pin.setMap(null)
    }
  }, [google, map, parkings, stats, selectedId])

  useEffect(() => () => Object.values(pinsRef.current).forEach((pin) => pin.setMap(null)), [])
}
