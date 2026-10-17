// Мали помошници за localStorage (во приватен прозорец може да не работи)
export const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ништо */ }
}
