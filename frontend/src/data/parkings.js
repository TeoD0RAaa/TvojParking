/*
  Паркинзите во Скопје.
  - lat, lng: вистинската локација на мапата
  - blocks: како изгледа паркингот одвнатре (блокови / катови -> редови -> места)
  - occupancy: колкав дел е зафатен (0 = празен, 1 = полн). Ова е тест-податок;
    подоцна ќе доаѓа од backend / сензори.
*/
const block = (name, rows, perRow) => ({ name, rows, perRow })

export const PARKINGS = [
  {
    id: 'post', name: 'Паркинг Пошта на Македонија', type: 'Отворен паркинг',
    address: 'ул. Орце Николов, Центар', lat: 41.99820, lng: 21.42934, pricePerHour: 50,
    blocks: [block('Блок А', 3, 6), block('Блок Б', 3, 6)], occupancy: 0.85,
  },
  {
    id: '26juli', name: 'Катна гаража „26 Јули“', type: 'Катна гаража',
    address: 'бул. Св. Кирил и Методиј 5', lat: 41.98968, lng: 21.43178, pricePerHour: 60,
    blocks: [block('Кат -1', 3, 8), block('Кат 1', 3, 8), block('Кат 2', 3, 8)], occupancy: 0.55,
  },
  {
    id: 'razlovecko', name: 'Катна гаража „Разловечко востание“', type: 'Катна гаража',
    address: 'ул. Мирче Ацев 2', lat: 41.99336, lng: 21.43616, pricePerHour: 60,
    blocks: [block('Кат 1', 3, 8), block('Кат 2', 3, 8), block('Кат 3', 3, 8)], occupancy: 0.6,
  },
  {
    id: 'kale', name: 'Паркинг Кале', type: 'Отворен паркинг',
    address: 'Тврдина Кале', lat: 42.00221, lng: 21.43270, pricePerHour: 40,
    blocks: [block('Блок А', 2, 8), block('Блок Б', 2, 8)], occupancy: 0.4,
  },
  {
    id: 'bushi', name: 'Паркинг „Буши“', type: 'Отворен паркинг',
    address: 'ул. Ќурчиска 21, Стара чаршија', lat: 42.00156, lng: 21.43583, pricePerHour: 50,
    blocks: [block('Блок А', 2, 6), block('Блок Б', 2, 6)], occupancy: 0.9,
  },
  {
    id: 'gradski-park', name: 'Паркинг Градски парк', type: 'Отворен паркинг',
    address: 'Градски парк, Карпош', lat: 42.00649, lng: 21.42232, pricePerHour: 40,
    blocks: [block('Блок А', 3, 6), block('Блок Б', 3, 6), block('Блок В', 3, 6)], occupancy: 0.3,
  },
  {
    id: 'zoo', name: 'Паркинг Зоолошка градина', type: 'Отворен паркинг',
    address: 'бул. Илинден 89', lat: 42.00534, lng: 21.41783, pricePerHour: 40,
    blocks: [block('Блок А', 3, 8), block('Блок Б', 3, 8)], occupancy: 0.8,
  },
  {
    id: 'zoo2', name: 'Паркинг 2 – Зоолошка градина', type: 'Отворен паркинг',
    address: 'Зоолошка градина', lat: 42.00604, lng: 21.41646, pricePerHour: 30,
    blocks: [block('Блок А', 3, 6), block('Блок Б', 3, 6)], occupancy: 0.2,
  },
  {
    id: 'treska', name: 'Паркинг Треска', type: 'Отворен паркинг',
    address: 'ул. Народен фронт 31', lat: 41.99470, lng: 21.41290, pricePerHour: 40,
    blocks: [block('Блок А', 3, 6), block('Блок Б', 3, 6)], occupancy: 0.75,
  },
  {
    id: 'klinicki', name: 'Паркинг Клинички центар', type: 'Отворен паркинг',
    address: 'ул. Водњанска, Клинички центар', lat: 41.98826, lng: 21.42416, pricePerHour: 30,
    blocks: [block('Блок А', 3, 8), block('Блок Б', 3, 8), block('Блок В', 3, 8), block('Блок Г', 3, 8)], occupancy: 1,
  },
  {
    id: 'univ-klinika', name: 'Паркинг Универзитетска клиника', type: 'Отворен паркинг',
    address: 'Центар', lat: 41.98950, lng: 21.42115, pricePerHour: 30,
    blocks: [block('Блок А', 2, 6), block('Блок Б', 2, 6)], occupancy: 1,
  },
  {
    id: 'zoil', name: 'Паркинг Зоил', type: 'Отворен паркинг',
    address: 'Центар', lat: 41.98975, lng: 21.43650, pricePerHour: 50,
    blocks: [block('Блок А', 3, 6)], occupancy: 0.5,
  },
]
