export const CENTER = { lat: 41.9975, lng: 21.4255 }
const PARKING_ZOOM = 17
const ORIGIN_ZOOM = 15

// Без туѓи POI-ја, за да се гледаат само нашите паркинзи
const BASE_STYLES = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]
const LIGHT_STYLES = [{ stylers: [{ saturation: -100 }] }]
const DARK_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#212327' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8f96' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1b1d20' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2f3237' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a3e44' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#16181b' }] },
]

// Сива мапа (светла или темна, според темата)
export const mapStyles = (theme) => [...(theme === 'dark' ? DARK_STYLES : LIGHT_STYLES), ...BASE_STYLES]

export const mapOptions = (theme) => ({
  center: CENTER,
  zoom: 15,
  styles: mapStyles(theme),
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  gestureHandling: 'greedy',
})

function flyTo(map, { lat, lng }, zoom) {
  map.panTo({ lat, lng })
  map.setZoom(zoom)
}
export const focusParking = (map, parking) => flyTo(map, parking, PARKING_ZOOM)
export const focusOrigin = (map, origin) => flyTo(map, origin, ORIGIN_ZOOM)
