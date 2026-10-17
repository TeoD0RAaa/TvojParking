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
  return `<div class="pin pin--${a.level}${active ? ' pin--active' : ''}">
            <span class="pin__p">P</span><span class="pin__n">${free}</span>
          </div>`
}

// HTML пин на Google мапата (OverlayView), центриран на lat/lng
function createPinClass(google) {
  return class HtmlPin extends google.maps.OverlayView {
    constructor(position, onClick) {
      super()
      this.position = new google.maps.LatLng(position)
      this.div = document.createElement('div')
      this.div.className = 'gpin'
      this.div.addEventListener('click', (e) => { e.stopPropagation(); onClick() })
    }
    onAdd() { this.getPanes().overlayMouseTarget.appendChild(this.div) }
    draw() {
      const p = this.getProjection().fromLatLngToDivPixel(this.position)
      if (p) { this.div.style.left = `${p.x}px`; this.div.style.top = `${p.y}px` }
    }
    onRemove() { this.div.remove() }
  }
}

export default function ParkingMap({ parkings, stats, selectedId, onSelect }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const pinsRef = useRef({})
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  // Мапата и пиновите се прават еднаш
  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then((google) => {
        if (cancelled || mapRef.current) return
        const map = new google.maps.Map(containerRef.current, {
          center: CENTER,
          zoom: 15,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
        })
        const HtmlPin = createPinClass(google)
        for (const p of parkings) {
          const pin = new HtmlPin({ lat: p.lat, lng: p.lng }, () => onSelectRef.current(p.id))
          pin.setMap(map)
          pinsRef.current[p.id] = pin
        }
        mapRef.current = map
        setReady(true)
      })
      .catch((e) => !cancelled && setError(e.message))
    return () => { cancelled = true }
  }, [parkings])

  // Бојата и бројот на пиновите се освежуваат кога ќе се промени зафатеноста
  useEffect(() => {
    if (!ready) return
    for (const p of parkings) {
      const pin = pinsRef.current[p.id]
      const active = p.id === selectedId
      pin.div.innerHTML = pinHtml(stats[p.id].free, stats[p.id].total, active)
      pin.div.style.zIndex = active ? 1000 : 0
    }
  }, [ready, parkings, stats, selectedId])

  // Кога ќе избереш паркинг, мапата лета до него
  useEffect(() => {
    const selected = parkings.find((p) => p.id === selectedId)
    if (!ready || !selected) return
    mapRef.current.panTo({ lat: selected.lat, lng: selected.lng })
    mapRef.current.setZoom(17)
  }, [ready, parkings, selectedId])

  return (
    <div className="map">
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {error && <div className="map-error">{error}</div>}
    </div>
  )
}
