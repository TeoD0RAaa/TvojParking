export const CENTER = { lat: 41.9975, lng: 21.4255 }
const FOCUS_ZOOM = 17

// Сива мапа без туѓи POI-ја, за да се гледаат само нашите паркинзи
const MAP_STYLES = [
  { stylers: [{ saturation: -100 }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]

export const MAP_OPTIONS = {
  center: CENTER,
  zoom: 15,
  styles: MAP_STYLES,
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  gestureHandling: 'greedy',
}

// Мапата лета до паркингот
export function focusOn(map, { lat, lng }) {
  map.panTo({ lat, lng })
  map.setZoom(FOCUS_ZOOM)
}
