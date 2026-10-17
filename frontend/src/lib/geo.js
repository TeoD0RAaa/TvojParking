// Растојание меѓу две точки на Земјата (формула на Haversine), во километри
export function distanceKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Пешачење ~5 km/h, а улиците не се права линија, па множиме со 1.3
export const walkMinutes = (km) => Math.max(1, Math.round(((km * 1.3) / 5) * 60))

export function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 100) * 10} м` : `${km.toFixed(1)} км`
}

// Линк што го отвора Google Maps со правец до паркингот (не бара API клуч)
export const directionsUrl = (p) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`

export const SKOPJE_CENTER = { lat: 41.9961, lng: 21.4316, name: 'Плоштад Македонија' }

// Ја бара твојата локација. Ако одбиеш или си надвор од Скопје -> Плоштад.
export function getMyLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ ...SKOPJE_CENTER, fallback: true })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Твоја локација' }
        resolve(distanceKm(me, SKOPJE_CENTER) > 20 ? { ...SKOPJE_CENTER, fallback: true } : me)
      },
      () => resolve({ ...SKOPJE_CENTER, fallback: true }),
      { timeout: 6000 }
    )
  })
}
