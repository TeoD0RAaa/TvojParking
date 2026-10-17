export const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit' })

export const normalizePlate = (plate) => plate.trim().toUpperCase()

export const isValidPlate = (plate) => plate.trim().length >= 4
