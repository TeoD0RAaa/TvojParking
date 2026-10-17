import { useState } from 'react'
import { load, save } from '../utils/storage.js'

// ДЕМО најава: нема лозинка, само копче. Корисникот се чува во прелистувачот.
const DEMO_USER = { id: 'demo', name: 'Демо корисник', email: 'demo@tvojparking.mk' }

export function useAuth() {
  const [user, setUser] = useState(() => load('tp.user', null))
  const login = () => { setUser(DEMO_USER); save('tp.user', DEMO_USER) }
  const logout = () => { setUser(null); save('tp.user', null) }
  return { user, login, logout }
}
