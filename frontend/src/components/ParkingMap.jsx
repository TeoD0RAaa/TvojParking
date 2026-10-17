import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { availability } from '../lib/spots.js'

// Пинот е обичен HTML: круг во боја со бројот на слободни места
function pinIcon(free, total, active) {
  const a = availability(free, total)
  return L.divIcon({
    className: '',
    html: `<div class="pin pin--${a.level}${active ? ' pin--active' : ''}">
             <span class="pin__p">P</span><span class="pin__n">${free}</span>
           </div>`,
    iconSize: [54, 30],
    iconAnchor: [27, 15],
  })
}

// Кога ќе избереш паркинг, мапата лета до него
function FlyTo({ parking }) {
  const map = useMap()
  useEffect(() => {
    if (parking) map.flyTo([parking.lat, parking.lng], 17, { duration: 0.8 })
  }, [parking, map])
  return null
}

export default function ParkingMap({ parkings, stats, selectedId, onSelect }) {
  const selected = parkings.find((p) => p.id === selectedId)
  return (
    <MapContainer center={[41.9975, 21.4255]} zoom={15} className="map" zoomControl={false}>
      {/* CARTO „light“ плочки + CSS сиво (види .map .leaflet-tile-pane во App.css) */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      {parkings.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={pinIcon(stats[p.id].free, stats[p.id].total, p.id === selectedId)}
          zIndexOffset={p.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(p.id) }}
        />
      ))}
      <FlyTo parking={selected} />
    </MapContainer>
  )
}
