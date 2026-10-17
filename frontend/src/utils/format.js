export const formatTime = (ms) =>
  new Date(ms).toLocaleTimeString('mk-MK', { hour: '2-digit', minute: '2-digit', hour12: false })

export const pad2 = (n) => String(n).padStart(2, '0')

export const normalizePlate = (plate) => plate.trim().toUpperCase()

export const isValidPlate = (plate) => plate.trim().length >= 4

export const isValidName = (name) => name.trim().length >= 2
