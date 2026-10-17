import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '../lib/loadGoogleMaps.js'
import { availability } from '../lib/spots.js'

const CENTER = { lat: 41.9975, lng: 21.4255 }

// Сива мапа без туѓи POI-ја, за да се гледаат само нашите паркинзи
const MAP_STYLES = [
  { stylers: [{ saturation: -100 }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]

// Пинот е обичен HTML: круг во боја со бројот на слободни места
function pinHtml(free, total, active) {
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

const originIcon = L.divIcon({ className: '', html: '<div class="origin"><span></span></div>', iconSize: [22, 22], iconAnchor: [11, 11] })

function FlyTo({ parking, origin }) {
  const map = useMap()
  useEffect(() => {
    if (parking) map.flyTo([parking.lat, parking.lng], 17, { duration: 0.8 })
  }, [parking, map])
  useEffect(() => {
    if (origin && !parking) map.flyTo([origin.lat, origin.lng], 15, { duration: 0.8 })
  }, [origin]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

export default function ParkingMap({ parkings, stats, selectedId, onSelect, origin, theme }) {
  const selected = parkings.find((p) => p.id === selectedId)
  return (
    <MapContainer center={[41.9975, 21.4255]} zoom={15} className="map" zoomControl={false}>
      {/* CARTO плочки + CSS сиво (види .map .leaflet-tile-pane во App.css) */}
      <TileLayer
        key={theme}
        url={TILES[theme]}
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
      {origin && <Marker position={[origin.lat, origin.lng]} icon={originIcon} zIndexOffset={2000} />}
      <FlyTo parking={selected} origin={origin} />
    </MapContainer>
  )
}
