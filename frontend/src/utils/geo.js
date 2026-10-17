import { inMacedonia } from '../data/cities.js'

// Растојание меѓу две точки на Земјата (формула на Haversine), во километри
export function distanceKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Најблискиот паркинг до дадена точка
export const nearestParking = (from, parkings) =>
  parkings.reduce((a, b) => (distanceKm(from, b) < distanceKm(from, a) ? b : a))

// Пешачење ~5 km/h, а улиците не се права линија, па множиме со 1.3
export const walkMinutes = (km) => Math.max(1, Math.round(((km * 1.3) / 5) * 60))

export function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 100) * 10} м` : `${km.toFixed(1)} км`
}

// Линк што го отвора Google Maps со правец до паркингот (не бара API клуч)
export const directionsUrl = (p) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`

export const SKOPJE_CENTER = { lat: 41.9961, lng: 21.4316, name: 'Плоштад Македонија' }

// Ја бара твојата локација. Ако одбиеш или си надвор од Македонија -> центарот на `fallback` градот.
export function getMyLocation(fallback = SKOPJE_CENTER) {
  const fb = { lat: fallback.lat, lng: fallback.lng, name: fallback.name, fallback: true }
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(fb)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Твоја локација' }
        resolve(inMacedonia(me) ? me : fb)
      },
      () => resolve(fb),
      { timeout: 6000 }
    )
  })
}

// Најблискиот град до дадена точка
export const nearestCity = (point, cities) =>
  cities.reduce((a, b) => (distanceKm(point, b) < distanceKm(point, a) ? b : a))
