import { useState } from 'react'
import { normalizePlate } from '../../utils/format.js'
import './reservations.css'

export default function ProfileForm({ profile, setProfile }) {
  const [name, setName] = useState(profile?.name || '')
  const [plate, setPlate] = useState(profile?.plate || '')

  const save = (e) => {
    e.preventDefault()
    if (name.trim()) setProfile({ name: name.trim(), plate: normalizePlate(plate) })
  }

  return (
    <form className="profile" onSubmit={save}>
      <h3>Профил</h3>
      <label>Име<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Теодора" /></label>
      <label>Регистарска<input className="upper" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="SK-1234-AB" /></label>
      <button className="small primary">Зачувај</button>
      {profile && <span className="muted"> Најавени како <b>{profile.name}</b></span>}
    </form>
  )
}
