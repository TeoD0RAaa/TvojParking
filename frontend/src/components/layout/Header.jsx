import ModeBadge from './ModeBadge.jsx'
import './layout.css'

// Лого, режим (сервер/демо), пауза на симулацијата и темен режим
export default function Header({ mode, live, onToggleLive, theme, onToggleTheme }) {
  return (
    <header className="brand">
      <span className="brand__logo">P</span>
      <span className="brand__name">Tvoj<b>Parking</b></span>
      <ModeBadge mode={mode} />
      <button className="icon-btn" onClick={onToggleLive} title="Симулација во живо">
        {live ? '⏸' : '▶'}
      </button>
      <button className="icon-btn" onClick={onToggleTheme} title="Темен режим">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  )
}
