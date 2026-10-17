import { useEffect, useState } from 'react'
import { load, save } from '../utils/storage.js'

// Светла / темна тема, се памти во прелистувачот
export function useTheme() {
  const [theme, setTheme] = useState(() => load('tp.theme', 'light'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save('tp.theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return [theme, toggleTheme]
}
