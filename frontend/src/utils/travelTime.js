/*
  Колку време ти треба со кола до паркингот → толку време имаш да пристигнеш + 5 мин резерва.
    10 мин возење → 15 мин,   30 мин возење → 35 мин
  Времето го зема од Google (Routes, со сообраќај во живо). Ако Google не одговори,
  користи наша проценка од растојанието.
*/
import { loadGoogleMaps } from './googleMaps.js'
import { distanceKm } from './geo.js'

export const EXTRA_MIN = 5      // резерва што се додава на секое возење
const MIN_GRACE = 5
const MAX_GRACE = 120           // да не може некој да „чува“ место цел ден
const CITY_KMH = 25             // просечна брзина низ град
const ROAD_KMH = 70             // меѓу градови (автопат / регионален пат)
const INTERCITY_KM = 15         // подалеку од ова = возење меѓу градови
const ROAD_FACTOR = 1.4         // улиците не се права линија

// Колку минути имаш да пристигнеш, за дадено време на возење
export const graceForDrive = (driveMin) =>
  Math.min(MAX_GRACE, Math.max(MIN_GRACE, Math.ceil(driveMin) + EXTRA_MIN))

// Наша проценка ако Google не е достапен
export function estimateDriveMin(from, to) {
  const km = distanceKm(from, to) * ROAD_FACTOR
  const kmh = km > INTERCITY_KM ? ROAD_KMH : CITY_KMH
  return Math.max(1, Math.round((km / kmh) * 60))
}

async function googleDriveMin(from, to) {
  const google = await loadGoogleMaps()
  const { Route } = await google.maps.importLibrary('routes')
  const { routes } = await Route.computeRoutes({
    origin: { lat: from.lat, lng: from.lng },
    destination: { lat: to.lat, lng: to.lng },
    travelMode: 'DRIVING',
    routingPreference: 'TRAFFIC_AWARE',
    fields: ['durationMillis', 'distanceMeters'],
  })
  const ms = routes?.[0]?.durationMillis
  if (!ms) throw new Error('Google не врати рута')
  return Math.max(1, Math.round(ms / 60_000))
}

// { driveMin, graceMin, source: 'google' | 'estimate' }
export async function travelTime(from, to) {
  let driveMin
  let source = 'google'
  try {
    driveMin = await googleDriveMin(from, to)
  } catch (err) {
    console.warn('Google Routes не одговори, користам проценка:', err.message)
    driveMin = estimateDriveMin(from, to)
    source = 'estimate'
  }
  return { driveMin, graceMin: graceForDrive(driveMin), source }
}
