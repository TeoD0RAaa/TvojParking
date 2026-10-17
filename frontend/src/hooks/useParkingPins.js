import { useEffect, useRef } from 'react'
import { createPinClass } from '../utils/mapPins.js'

// Пин за секој паркинг на Google мапата
export function useParkingPins({ google, map, parkings, stats, selectedId, onSelect }) {
  const pinsRef = useRef({})
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Пиновите се прават кога мапата е готова
  useEffect(() => {
    if (!map) return
    const HtmlPin = createPinClass(google)
    const pins = {}
    for (const p of parkings) {
      pins[p.id] = new HtmlPin({ lat: p.lat, lng: p.lng }, () => onSelectRef.current(p.id))
      pins[p.id].setMap(map)
    }
    pinsRef.current = pins
    return () => Object.values(pins).forEach((pin) => pin.setMap(null))
  }, [google, map, parkings])

  // Бојата и бројот се освежуваат кога ќе се промени зафатеноста или изборот
  useEffect(() => {
    if (!map) return
    for (const p of parkings) pinsRef.current[p.id].update(stats[p.id], p.id === selectedId)
  }, [map, parkings, stats, selectedId])
}
