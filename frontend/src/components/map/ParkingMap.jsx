import { useEffect, useRef } from 'react'
import { useGoogleMap } from '../../hooks/useGoogleMap.js'
import { useParkingPins } from '../../hooks/useParkingPins.js'
import { useOriginMarker } from '../../hooks/useOriginMarker.js'
import { focusCity, focusOrigin, focusParking } from '../../utils/mapConfig.js'
import './map.css'

export default function ParkingMap({ parkings, stats, selectedId, onSelect, origin, city, theme }) {
  const containerRef = useRef(null)
  const { google, map, error } = useGoogleMap(containerRef, theme)
  useParkingPins({ google, map, parkings, stats, selectedId, onSelect })
  useOriginMarker({ google, map, origin })

  const selected = parkings.find((p) => p.id === selectedId)

  // Кога ќе избереш паркинг, мапата лета до него
  useEffect(() => {
    if (map && selected) focusParking(map, selected)
  }, [map, selected])

  // Кога ќе се смени градот (а нема избран паркинг), мапата лета до центарот на градот
  useEffect(() => {
    if (map && city && !selected) focusCity(map, city)
  }, [map, city?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Кога ќе се смени локацијата (а нема избран паркинг), лета до неа
  useEffect(() => {
    if (map && origin && !selected) focusOrigin(map, origin)
  }, [map, origin]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map">
      <div ref={containerRef} className="map__canvas" />
      {error && <div className="map-error">{error}</div>}
    </div>
  )
}
