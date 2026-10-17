/*
  Паркинзите во Скопје.
  - lat, lng: вистинската локација (имињата и локациите се вистински)
  - capacity: вкупно места (без блокови — сите се нумерирани по ред 01, 02, 03 …)
  - accessible: колку од првите места се за лица со попреченост (♿)
  - occupancy: почетен процент зафатени места (0..1)  ← СИМУЛИРАНО
  - category: за предвидувањето (center | hospital | leisure | residential)
  - ev: дали има места за полнење електрични возила
*/
export const PARKINGS = [
  {
    id: 'post', name: 'Паркинг Пошта на Македонија', type: 'Отворен паркинг', category: 'center',
    address: 'ул. Орце Николов, Центар', lat: 41.99820, lng: 21.42934, pricePerHour: 50, ev: false,
    capacity: 36, accessible: 2, occupancy: 0.85,
  },
  {
    id: '26juli', name: 'Катна гаража „26 Јули“', type: 'Катна гаража', category: 'center',
    address: 'бул. Св. Кирил и Методиј 5', lat: 41.98968, lng: 21.43178, pricePerHour: 60, ev: true,
    capacity: 72, accessible: 4, occupancy: 0.55,
  },
  {
    id: 'razlovecko', name: 'Катна гаража „Разловечко востание“', type: 'Катна гаража', category: 'center',
    address: 'ул. Мирче Ацев 2', lat: 41.99336, lng: 21.43616, pricePerHour: 60, ev: true,
    capacity: 72, accessible: 4, occupancy: 0.6,
  },
  {
    id: 'kale', name: 'Паркинг Кале', type: 'Отворен паркинг', category: 'leisure',
    address: 'Тврдина Кале', lat: 42.00221, lng: 21.43270, pricePerHour: 40, ev: false,
    capacity: 32, accessible: 2, occupancy: 0.4,
  },
  {
    id: 'bushi', name: 'Паркинг „Буши“', type: 'Отворен паркинг', category: 'center',
    address: 'ул. Ќурчиска 21, Стара чаршија', lat: 42.00156, lng: 21.43583, pricePerHour: 50, ev: false,
    capacity: 24, accessible: 2, occupancy: 0.9,
  },
  {
    id: 'gradski-park', name: 'Паркинг Градски парк', type: 'Отворен паркинг', category: 'leisure',
    address: 'Градски парк, Карпош', lat: 42.00649, lng: 21.42232, pricePerHour: 40, ev: true,
    capacity: 54, accessible: 2, occupancy: 0.3,
  },
  {
    id: 'zoo', name: 'Паркинг Зоолошка градина', type: 'Отворен паркинг', category: 'leisure',
    address: 'бул. Илинден 89', lat: 42.00534, lng: 21.41783, pricePerHour: 40, ev: false,
    capacity: 48, accessible: 2, occupancy: 0.8,
  },
  {
    id: 'zoo2', name: 'Паркинг 2 – Зоолошка градина', type: 'Отворен паркинг', category: 'leisure',
    address: 'Зоолошка градина', lat: 42.00604, lng: 21.41646, pricePerHour: 30, ev: false,
    capacity: 36, accessible: 2, occupancy: 0.2,
  },
  {
    id: 'treska', name: 'Паркинг Треска', type: 'Отворен паркинг', category: 'residential',
    address: 'ул. Народен фронт 31', lat: 41.99470, lng: 21.41290, pricePerHour: 40, ev: false,
    capacity: 36, accessible: 2, occupancy: 0.75,
  },
  {
    id: 'klinicki', name: 'Паркинг Клинички центар', type: 'Отворен паркинг', category: 'hospital',
    address: 'ул. Водњанска, Клинички центар', lat: 41.98826, lng: 21.42416, pricePerHour: 30, ev: false,
    capacity: 96, accessible: 4, occupancy: 1,
  },
  {
    id: 'univ-klinika', name: 'Паркинг Универзитетска клиника', type: 'Отворен паркинг', category: 'hospital',
    address: 'Центар', lat: 41.98950, lng: 21.42115, pricePerHour: 30, ev: false,
    capacity: 24, accessible: 2, occupancy: 1,
  },
  {
    id: 'zoil', name: 'Паркинг Зоил', type: 'Отворен паркинг', category: 'center',
    address: 'Центар', lat: 41.98975, lng: 21.43650, pricePerHour: 50, ev: false,
    capacity: 18, accessible: 2, occupancy: 0.5,
  },
]

export const PARKINGS_BY_ID = Object.fromEntries(PARKINGS.map((p) => [p.id, p]))
