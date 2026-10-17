import { useState } from 'react'
import { load, save } from '../utils/storage.js'
import { ALL_CITIES, CITIES_BY_ID, DEFAULT_CITY } from '../data/cities.js'

// Избраниот град или „all“ = сите градови (се памти во прелистувачот)
const byId = (id) => (id === 'all' ? ALL_CITIES : CITIES_BY_ID[id])
export function useCity() {
  const [cityId, setCityState] = useState(() => {
    const saved = load('tp.city', DEFAULT_CITY)
    return byId(saved) ? saved : DEFAULT_CITY
  })
  const setCity = (id) => { if (byId(id)) { setCityState(id); save('tp.city', id) } }
  return [byId(cityId), setCity]
}
