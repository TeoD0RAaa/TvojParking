import { useMemo, useRef, useState } from 'react'
import { LANDMARKS } from '../../data/landmarks.js'
import { PARKINGS } from '../../data/parkings.js'
import { CITIES, CITIES_BY_ID } from '../../data/cities.js'

const MAX_RESULTS = 7

const SearchIcon = () => (
  <svg className="sbox__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
)
const TargetIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
)

const matches = (text, q) => text.toLowerCase().includes(q)

/*
  Пребарување „Каде одиш?“: пишуваш место (на кирилица или латиница) и бираш од предлозите.
  - град (Битола, Охрид…) -> се менува градот
  - место (Кале, Широк сокак…) -> листата се подредува по растојание од него (и градот се менува ако треба)
  - паркинг -> директно се отвора
  Прво се покажуваат резултатите од избраниот град.
  „Близу мене“ -> твојата GPS локација.
*/
export default function OriginPicker({ origin, setOrigin, onLocate, locating, city, setCity, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const here = (x) => (x.city === city.id ? 0 : 1) // прво од избраниот град
    const where = (x) => (x.city === city.id ? undefined : CITIES_BY_ID[x.city]?.name)
    const cities = q
      ? CITIES.filter((c) => c.id !== city.id && (matches(c.name, q) || matches(c.latin, q)))
        .map((c) => ({ type: 'city', key: `c-${c.id}`, label: c.name, sub: 'смени град', item: c }))
      : []
    const places = LANDMARKS
      .filter((l) => (q ? matches(l.name, q) || l.aliases.some((a) => matches(a, q)) : l.city === city.id))
      .sort((a, b) => here(a) - here(b))
      .map((l) => ({ type: 'place', key: `l-${l.id}`, label: l.name, sub: where(l), item: l }))
    const lots = q
      ? PARKINGS.filter((p) => matches(p.name, q) || matches(p.address, q))
        .sort((a, b) => here(a) - here(b))
        .map((p) => ({ type: 'parking', key: `p-${p.id}`, label: p.name, sub: where(p) || p.address, item: p }))
      : []
    return [...cities, ...places, ...lots].slice(0, MAX_RESULTS)
  }, [query, city.id])

  const choose = (r) => {
    if (r.type === 'city') setCity(r.item.id)
    else if (r.type === 'place') {
      if (r.item.city !== city.id) setCity(r.item.city)
      setOrigin(r.item)
    } else onSelect(r.item.id)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (e) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % results.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + results.length) % results.length) }
    if (e.key === 'Enter') { e.preventDefault(); choose(results[active]) }
    if (e.key === 'Escape') setOpen(false)
  }

  const nearMe = origin?.mine

  return (
    <div className="sbox-wrap">
      <div className={`sbox${open ? ' sbox--open' : ''}`}>
        <SearchIcon />
        {origin && !open ? (
          <button className="sbox__chosen" onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0) }}>
            {origin.name}
          </button>
        ) : (
          <input
            ref={inputRef}
            value={query}
            placeholder={city.id === 'skopje' ? 'Кале, плоштад, Клинички…' : city.id === 'all' ? 'Град или место: Битола, Канео, Кале…' : `Место во ${city.name} или друг град…`}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0) }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={onKeyDown}
            aria-label="Каде одиш?"
          />
        )}
        {origin && !open && (
          <button className="sbox__clear" onClick={() => setOrigin(null)} aria-label="Исчисти">×</button>
        )}
        <button className={`sbox__near${nearMe ? ' sbox__near--on' : ''}`} onClick={onLocate} disabled={locating}>
          <TargetIcon /> {locating ? 'Барам…' : 'Близу мене'}
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className="sbox__list">
          {results.map((r, i) => (
            <li key={r.key}>
              <button className={i === active ? 'on' : ''} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r)} onMouseEnter={() => setActive(i)}>
                <span className="sbox__kind">{{ city: '🏙️', place: '📍', parking: '🅿️' }[r.type]}</span>
                <span className="sbox__text"><b>{r.label}</b>{r.sub && <small>{r.sub}</small>}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && query.trim() && <div className="sbox__list sbox__empty">Нема такво место. Пробај друго место или име на град.</div>}

      {origin && (
        <p className="origin-note">
          Подредено по растојание од <b>{origin.name}</b>{origin.fallback && ' (не можам да те лоцирам)'}
        </p>
      )}
    </div>
  )
}
