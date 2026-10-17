/*
  Градовите во Македонија каде работи TvojParking.
  lat/lng = центарот на градот (каде лета мапата кога ќе го избереш градот).
  seasonal: туристички град — во лето е многу погужвено (се користи во предвидувањето).
*/
export const CITIES = [
  { id: 'skopje', name: 'Скопје', latin: 'skopje', lat: 41.9961, lng: 21.4316, zoom: 14 },
  { id: 'bitola', name: 'Битола', latin: 'bitola', lat: 41.0311, lng: 21.3347, zoom: 15 },
  { id: 'ohrid', name: 'Охрид', latin: 'ohrid', lat: 41.1150, lng: 20.8010, zoom: 15, seasonal: true },
  { id: 'struga', name: 'Струга', latin: 'struga', lat: 41.1780, lng: 20.6785, zoom: 15, seasonal: true },
  { id: 'kumanovo', name: 'Куманово', latin: 'kumanovo', lat: 42.1322, lng: 21.7144, zoom: 15 },
  { id: 'tetovo', name: 'Тетово', latin: 'tetovo', lat: 42.0069, lng: 20.9715, zoom: 15 },
  { id: 'prilep', name: 'Прилеп', latin: 'prilep', lat: 41.3451, lng: 21.5550, zoom: 15 },
  { id: 'shtip', name: 'Штип', latin: 'stip shtip', lat: 41.7372, lng: 22.1936, zoom: 15 },
  { id: 'veles', name: 'Велес', latin: 'veles', lat: 41.7155, lng: 21.7756, zoom: 15 },
  { id: 'strumica', name: 'Струмица', latin: 'strumica', lat: 41.4378, lng: 22.6427, zoom: 15 },
  { id: 'gostivar', name: 'Гостивар', latin: 'gostivar', lat: 41.7958, lng: 20.9089, zoom: 15 },
  { id: 'kavadarci', name: 'Кавадарци', latin: 'kavadarci', lat: 41.4331, lng: 22.0119, zoom: 15 },
  { id: 'kochani', name: 'Кочани', latin: 'kocani kochani', lat: 41.9164, lng: 22.4128, zoom: 15 },
  { id: 'gevgelija', name: 'Гевгелија', latin: 'gevgelija', lat: 41.1392, lng: 22.5025, zoom: 15 },
]

// „Сите градови“: целата земја одеднаш (мапата се оддалечува за да се гледа цела Македонија)
export const ALL_CITIES = { id: 'all', name: 'Цела Македонија', latin: 'site makedonija', lat: 41.62, lng: 21.72, zoom: 8 }

export const CITIES_BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c]))
export const DEFAULT_CITY = 'skopje'

// Приближно, дали точката е во Македонија
export const inMacedonia = ({ lat, lng }) => lat > 40.8 && lat < 42.4 && lng > 20.4 && lng < 23.1
