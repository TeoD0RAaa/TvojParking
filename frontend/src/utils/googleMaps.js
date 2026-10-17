// Го вчитува Google Maps JavaScript API еднаш и го враќа `google` објектот.
// Клучот е во frontend/.env.local како VITE_GOOGLE_MAPS_API_KEY (не оди на GitHub).
const CALLBACK_NAME = '__onGoogleMapsReady__'

let loaderPromise = null

export function loadGoogleMaps() {
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve(window.google)

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) return reject(new Error('Недостасува VITE_GOOGLE_MAPS_API_KEY во frontend/.env.local'))

    window[CALLBACK_NAME] = () => resolve(window.google)

    const params = new URLSearchParams({ key: apiKey, callback: CALLBACK_NAME, loading: 'async', v: 'weekly', language: 'mk' })
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.onerror = () => {
      loaderPromise = null
      reject(new Error('Не може да се вчита Google Maps'))
    }
    document.head.appendChild(script)
  })

  return loaderPromise
}
