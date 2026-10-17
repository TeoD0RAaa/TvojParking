import { useEffect, useState } from 'react'

// Часовник: за одбројувањето и истекувањето на резервациите
export function useNow(intervalMs = 15000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}
