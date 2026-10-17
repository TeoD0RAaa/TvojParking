// Познати места низ Македонија за пребарување „каде одиш?“ (city = во кој град)
// aliases: зборови (и на латиница) по кои асистентот ги препознава
export const LANDMARKS = [
  { city: 'skopje', id: 'ploshtad', name: 'Плоштад Македонија', lat: 41.99610, lng: 21.43160, aliases: ['плоштад', 'ploshtad', 'plostad', 'центар', 'centar', 'center', 'square'] },
  { city: 'skopje', id: 'kamen-most', name: 'Камен мост', lat: 41.99780, lng: 21.43320, aliases: ['камен мост', 'kamen most', 'мост', 'most', 'bridge'] },
  { city: 'skopje', id: 'kale', name: 'Тврдина Кале', lat: 42.00040, lng: 21.43390, aliases: ['кале', 'kale', 'тврдина', 'fortress'] },
  { city: 'skopje', id: 'carsija', name: 'Стара чаршија', lat: 42.00050, lng: 21.43850, aliases: ['чаршија', 'carsija', 'čaršija', 'charshija', 'bazaar', 'bazar'] },
  { city: 'skopje', id: 'gradski-park', name: 'Градски парк', lat: 42.00500, lng: 21.42000, aliases: ['градски парк', 'gradski park', 'парк', 'park'] },
  { city: 'skopje', id: 'zoo', name: 'Зоолошка градина', lat: 42.00580, lng: 21.41700, aliases: ['зоолошка', 'zooloska', 'зоо', 'zoo'] },
  { city: 'skopje', id: 'klinicki', name: 'Клинички центар', lat: 41.98860, lng: 21.42300, aliases: ['клинички', 'klinicki', 'клиника', 'klinika', 'болница', 'bolnica', 'hospital'] },

  // другите градови (приближни локации)
  { city: 'bitola', id: 'bt-sirok', name: 'Широк сокак', lat: 41.0300, lng: 21.3355, aliases: ['широк сокак', 'sirok sokak', 'shirok sokak', 'сокак'] },
  { city: 'bitola', id: 'bt-saat', name: 'Саат кула (Битола)', lat: 41.0318, lng: 21.3337, aliases: ['саат кула', 'saat kula'] },
  { city: 'bitola', id: 'bt-heraclea', name: 'Хераклеа Линкестис', lat: 41.0109, lng: 21.3426, aliases: ['хераклеа', 'heraclea', 'herakleja'] },
  { city: 'ohrid', id: 'oh-pristaniste', name: 'Пристаниште Охрид', lat: 41.1118, lng: 20.7978, aliases: ['пристаниште', 'pristaniste', 'port'] },
  { city: 'ohrid', id: 'oh-samoil', name: 'Самоилова тврдина', lat: 41.1153, lng: 20.7885, aliases: ['самоилова', 'samoilova', 'тврдина охрид'] },
  { city: 'ohrid', id: 'oh-kaneo', name: 'Св. Јован Канео', lat: 41.1108, lng: 20.7893, aliases: ['канео', 'kaneo'] },
  { city: 'ohrid', id: 'oh-plostad', name: 'Плоштад Охрид', lat: 41.1145, lng: 20.8015, aliases: ['центар охрид', 'centar ohrid'] },
  { city: 'struga', id: 'st-drim', name: 'Мостот на Црн Дрим', lat: 41.1782, lng: 20.6775, aliases: ['дрим', 'drim', 'мост струга'] },
  { city: 'kumanovo', id: 'ku-plostad', name: 'Плоштад Куманово', lat: 42.1322, lng: 21.7144, aliases: ['центар куманово', 'centar kumanovo'] },
  { city: 'tetovo', id: 'te-sarena', name: 'Шарена џамија', lat: 42.0090, lng: 20.9706, aliases: ['шарена џамија', 'sarena dzamija', 'шарена'] },
  { city: 'prilep', id: 'pr-marko', name: 'Маркови кули', lat: 41.3586, lng: 21.5419, aliases: ['маркови кули', 'markovi kuli'] },
  { city: 'shtip', id: 'sh-isar', name: 'Исар (Штип)', lat: 41.7400, lng: 22.1955, aliases: ['исар', 'isar'] },
  { city: 'shtip', id: 'sh-ugd', name: 'Универзитет Гоце Делчев', lat: 41.7405, lng: 22.1995, aliases: ['угд', 'ugd', 'универзитет штип'] },
  { city: 'strumica', id: 'su-centar', name: 'Центар Струмица', lat: 41.4378, lng: 22.6427, aliases: ['центар струмица', 'centar strumica'] },
]
