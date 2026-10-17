import { useMemo, useState } from 'react'
import { ALL_CITIES, CITIES } from '../../data/cities.js'
import { PARKINGS } from '../../data/parkings.js'
import './city.css'

// Град: копче „📍 Скопје ▾“ што отвора листа на сите градови со слободни места во живо
export default function CityPicker({ city, setCity, stats, onNearest, locating }) {
  const [open, setOpen] = useState(false)

  // по град: колку паркинзи и колку слободни места има сега
  const perCity = useMemo(() => {
    const out = {}
    for (const p of PARKINGS) {
      const c = (out[p.city] ||= { parkings: 0, free: 0, total: 0 })
      c.parkings += 1
      c.free += Math.max(0, stats[p.id].free)
      c.total += stats[p.id].total
    }
    return out
  }, [stats])

  const all = Object.values(perCity).reduce((a, c) => ({ parkings: a.parkings + c.parkings, free: a.free + c.free, total: a.total + c.total }), { parkings: 0, free: 0, total: 0 })
  const pick = (id) => { setCity(id); setOpen(false) }
  const cur = city.id === 'all' ? all : perCity[city.id] || { parkings: 0, free: 0 }

  return (
    <div className="city">
      <button className="city__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="city__pin">{city.id === 'all' ? '🗺️' : '📍'}</span>
        <span className="city__name">{city.name}</span>
        <span className="city__meta">{cur.free} слободни · {cur.parkings} паркинзи</span>
        <span className={`city__chev${open ? ' up' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="city__sheet">
          <button className="city__nearest" onClick={() => { setOpen(false); onNearest() }} disabled={locating}>
            🧭 {locating ? 'Те барам…' : 'Најблискиот град до мене'}
          </button>
          <button className={`city__all${city.id === 'all' ? ' on' : ''}`} onClick={() => pick(ALL_CITIES.id)}>
            <span>🗺️ <b>Сите градови</b></span>
            <span className="city__row-free"><b>{all.free}</b> слоб. · {all.parkings} паркинзи</span>
          </button>
          <ul className="city__list">
            {CITIES.map((c) => {
              const s = perCity[c.id] || { parkings: 0, free: 0, total: 0 }
              const pct = s.total ? Math.round((s.free / s.total) * 100) : 0
              return (
                <li key={c.id}>
                  <button className={c.id === city.id ? 'on' : ''} onClick={() => pick(c.id)}>
                    <span className="city__row-name">{c.name}{c.seasonal && <small> · туристички</small>}</span>
                    <span className="city__row-bar"><i style={{ width: `${pct}%` }} /></span>
                    <span className="city__row-free"><b>{s.free}</b> слоб.</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
