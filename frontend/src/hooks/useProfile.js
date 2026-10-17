import { useState } from 'react'
import { load, save } from '../utils/storage.js'

// Име и регистарска на корисникот: { name, plate } или null
export function useProfile() {
  const [profile, setProfileState] = useState(() => load('tp.profile', null))
  const setProfile = (p) => { setProfileState(p); save('tp.profile', p) }
  return [profile, setProfile]
}
