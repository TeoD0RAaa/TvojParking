import { useEffect, useRef } from 'react'
import { useGoogleMap } from '../../hooks/useGoogleMap.js'
import { useParkingPins } from '../../hooks/useParkingPins.js'
import { focusOn } from '../../utils/mapConfig.js'
import './map.css'

export default function ParkingMap({ parkings, stats, selectedId, onSelect }) {
  const containerRef = useRef(null)
  const { google, map, error } = useGoogleMap(containerRef)
  useParkingPins({ google, map, parkings, stats, selectedId, onSelect })

  // Кога ќе избереш паркинг, мапата лета до него
  useEffect(() => {
    const selected = parkings.find((p) => p.id === selectedId)
    if (map && selected) focusOn(map, selected)
  }, [map, parkings, selectedId])

  return (
    <div className="map">
      <div ref={containerRef} className="map__canvas" />
      {error && <div className="map-error">{error}</div>}
    </div>
  )
}
