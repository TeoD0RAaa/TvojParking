import { useState } from 'react'

// Кој таб е отворен во левиот панел и кој паркинг е избран
export function useNavigation() {
  const [view, setView] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [presetHours, setPresetHours] = useState(null)

  const openParking = (id, hours = null) => {
    setSelectedId(id)
    setPresetHours(hours)
    setView('details')
  }
  const goTo = (v) => {
    setView(v)
    if (v !== 'details') setSelectedId(null)
  }

  return { view, selectedId, presetHours, openParking, goTo }
}
