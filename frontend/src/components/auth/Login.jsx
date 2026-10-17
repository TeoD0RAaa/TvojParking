import { useState } from 'react'
import './auth.css'

// Почетен екран: ДЕМО најава со едно копче (без внесување податоци)
export default function Login({ onLogin }) {
  const [busy, setBusy] = useState(false)
  const login = () => {
    setBusy(true)
    setTimeout(onLogin, 600) // мала пауза за да личи на вистинска најава
  }
  return (
    <div className="login">
      <div className="login__card">
        <span className="brand__logo login__logo">P</span>
        <h1>Tvoj<b>Parking</b></h1>
        <p className="login__tag">Најди, резервирај и плати паркинг низ цела Македонија — за неколку секунди.</p>
        <ul className="login__list">
          <li>🅿️ Слободни места во живо</li>
          <li>🎫 Резервација + QR код</li>
          <li>💳 Плаќање со картичка</li>
        </ul>
        <button className="cta" onClick={login} disabled={busy}>
          {busy ? 'Се најавувам…' : 'Најави се'}
        </button>
        <p className="muted login__note">Демо најава — не треба име ни лозинка.</p>
      </div>
    </div>
  )
}
