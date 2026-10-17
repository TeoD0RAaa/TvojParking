import { useCallback, useEffect, useRef, useState } from 'react'

// Кратка порака што исчезнува сама после `duration` ms
export function useToast(duration = 3000) {
  const [message, setMessage] = useState(null)
  const timer = useRef(null)

  const show = useCallback((text) => {
    clearTimeout(timer.current)
    setMessage(text)
    timer.current = setTimeout(() => setMessage(null), duration)
  }, [duration])

  useEffect(() => () => clearTimeout(timer.current), [])

  return [message, show]
}
