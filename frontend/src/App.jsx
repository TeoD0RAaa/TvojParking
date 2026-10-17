import { useCallback, useEffect, useMemo, useState } from 'react'
import ParkingMap from './components/ParkingMap.jsx'
import ParkingList from './components/ParkingList.jsx'
import ParkingDetails from './components/ParkingDetails.jsx'
import MyReservations from './components/MyReservations.jsx'
import Assistant from './components/Assistant.jsx'
import Scanner from './components/Scanner.jsx'
import { PARKINGS, PARKINGS_BY_ID } from './data/parkings.js'
import { buildSpots, setTakenCount } from './lib/spots.js'
import { distanceKm, getMyLocation } from './lib/geo.js'
import { detectMode, getApi, isActive } from './lib/api.js'

// мали помошници за localStorage (во приватен прозорец може да не работи)
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ништо */ } }

const NAV = [
  { id: 'list', icon: '🅿️', label: 'Паркинзи' },
  { id: 'assistant', icon: '💬', label: 'Асистент' },
  { id: 'scanner', icon: '📷', label: 'AI скенер' },
  { id: 'mine', icon: '🎫', label: 'Мои' },
]

export default function App() {
  const [theme, setTheme] = useState(() => load('tp.theme', 'light'))
  const [live, setLive] = useState(true)
  const [mode, setMode] = useState('local')
  const [reservations, setReservations] = useState([])
  const [profile, setProfileState] = useState(() => load('tp.profile', null))
  const [view, setView] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [presetHours, setPresetHours] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [locating, setLocating] = useState(false)
  const [filters, setFilters] = useState({ type: 'all', onlyFree: false, cheap: false, accessible: false, ev: false })
  const [toast, setToast] = useState(null)
  const [now, setNow] = useState(Date.now())

  // места на секој паркинг + „целен“ процент зафатеност (за симулацијата во живо)
  const [spotsById, setSpotsById] = useState(() => Object.fromEntries(PARKINGS.map((p) => [p.id, buildSpots(p)])))
  const [targets, setTargets] = useState(() => Object.fromEntries(PARKINGS.map((p) => [p.id, p.occupancy])))

  const api = getApi(mode)
  const setProfile = (p) => { setProfileState(p); save('tp.profile', p) }
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => { document.documentElement.dataset.theme = theme; save('tp.theme', theme) }, [theme])

  // 1) провери дали backend-от е вклучен
  useEffect(() => { detectMode().then(setMode) }, [])

  // 2) вчитај резервации (на серверот: на секои 5 сек, за да ги видиш туѓите)
  const refresh = useCallback(() => getApi(mode).list().then(setReservations).catch(() => {}), [mode])
  useEffect(() => {
    refresh()
    if (mode !== 'server') return
    const t = setInterval(refresh, 5000)
    return () => clearInterval(t)
  }, [mode, refresh])

  // 3) часовник: за одбројувањето и истекувањето на резервациите
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t) }, [])

  const active = useMemo(() => reservations.filter((r) => isActive(r, now)), [reservations, now])
  const mine = useMemo(
    () => (mode === 'server' ? active.filter((r) => r.user === profile?.name) : active),
    [active, mode, profile]
  )
  const reservedByParking = useMemo(() => {
    const m = {}
    for (const r of active) (m[r.parkingId] ||= new Set()).add(r.spotId)
    return m
  }, [active])

  // 4) симулација „во живо“: на секои 5 сек некои коли влегуваат/излегуваат
  useEffect(() => {
    if (!live) return
    const t = setInterval(() => {
      setSpotsById((prev) => {
        const next = { ...prev }
        for (let k = 0; k < 3; k++) {
          const p = PARKINGS[Math.floor(Math.random() * PARKINGS.length)]
          const reserved = reservedByParking[p.id] || new Set()
          const spots = next[p.id].map((s) => ({ ...s }))
          const pool = spots.filter((s) => !reserved.has(s.id))
          const ratio = pool.filter((s) => s.taken).length / pool.length
          // се движиме кон целниот процент, со малку случајност
          const wantMoreCars = ratio < targets[p.id] - 0.03 ? true : ratio > targets[p.id] + 0.03 ? false : Math.random() < 0.5
          const options = pool.filter((s) => s.taken !== wantMoreCars)
          if (options.length) options[Math.floor(Math.random() * options.length)].taken = wantMoreCars
          next[p.id] = spots
        }
        return next
      })
    }, 5000)
    return () => clearInterval(t)
  }, [live, reservedByParking, targets])

  // статистика за секој паркинг
  const stats = useMemo(() => {
    const out = {}
    for (const p of PARKINGS) {
      const reserved = reservedByParking[p.id] || new Set()
      const freeSpots = spotsById[p.id].filter((s) => !s.taken && !reserved.has(s.id))
      out[p.id] = {
        total: spotsById[p.id].length,
        free: freeSpots.length,
        freeAccessible: freeSpots.filter((s) => s.kind === 'accessible').length,
        freeEv: freeSpots.filter((s) => s.kind === 'ev').length,
      }
    }
    return out
  }, [spotsById, reservedByParking])

  const filtered = PARKINGS.filter((p) => {
    const s = stats[p.id]
    if (filters.type === 'garage' && p.type !== 'Катна гаража') return false
    if (filters.type === 'open' && p.type === 'Катна гаража') return false
    if (filters.onlyFree && s.free <= 0) return false
    if (filters.cheap && p.pricePerHour > 40) return false
    if (filters.accessible && s.freeAccessible <= 0) return false
    if (filters.ev && s.freeEv <= 0) return false
    return true
  })

  const openParking = (id, hours = null) => { setSelectedId(id); setPresetHours(hours); setView('details') }
  const goTo = (v) => { setView(v); if (v !== 'details') setSelectedId(null) }

  const locate = async () => {
    setLocating(true)
    const me = await getMyLocation()
    setLocating(false)
    const o = { ...me, mine: !me.fallback }
    setOrigin(o)
    return o
  }

  const findBest = async () => {
    const o = await locate()
    const candidates = filtered.filter((p) => stats[p.id].free > 0)
    if (!candidates.length) return flash('Нема слободен паркинг со овие филтри 😕')
    const best = candidates.reduce((a, b) => (distanceKm(o, b) < distanceKm(o, a) ? b : a))
    openParking(best.id)
    flash(`Најблизок слободен: ${best.name}`)
  }

  const reserve = async ({ spotId, plate, hours, name }) => {
    if (!profile || profile.name !== name || profile.plate !== plate) setProfile({ name, plate })
    await api.create({ parkingId: selectedId, spotId, plate, user: name, hours })
    // местото е твое: симулацијата не смее да стави кола таму
    setSpotsById((prev) => ({ ...prev, [selectedId]: prev[selectedId].map((s) => (s.id === spotId ? { ...s, taken: false } : s)) }))
    await refresh()
    flash(`Резервирано: место ${spotId} ✓  QR кодот е во „Мои“`)
  }
  const checkIn = async (id) => { await api.checkIn(id); await refresh(); flash('Добредојде! Паркиран си ✓') }
  const cancel = async (id) => { await api.cancel(id); await refresh(); flash('Резервацијата е откажана') }

  // AI скенерот го менува бројот на зафатени места
  const applyScan = (pid, cars) => {
    const total = spotsById[pid].length
    setTargets((t) => ({ ...t, [pid]: cars / total }))
    setSpotsById((prev) => {
      const spots = prev[pid].map((s) => ({ ...s }))
      setTakenCount(spots, cars, Math.random, reservedByParking[pid] || new Set())
      return { ...prev, [pid]: spots }
    })
    flash(`${PARKINGS_BY_ID[pid].name}: ${cars} коли од камерата`)
    openParking(pid)
  }

  const selected = PARKINGS_BY_ID[selectedId]

  return (
    <div className="app">
      <aside className="panel">
        <header className="brand">
          <span className="brand__logo">P</span>
          <span className="brand__name">Tvoj<b>Parking</b></span>
          <span className={`mode mode--${mode}`} title={mode === 'server' ? 'Поврзано со FastAPI backend' : 'Backend-от не е вклучен — резервациите се само во овој прелистувач'}>
            {mode === 'server' ? '● Сервер' : '● Демо'}
          </span>
          <button className="icon-btn" onClick={() => setLive((l) => !l)} title="Симулација во живо">
            {live ? '⏸' : '▶'}
          </button>
          <button className="icon-btn" onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} title="Темен режим">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <nav className="tabs">
          {NAV.map((n) => (
            <button key={n.id} className={view === n.id || (n.id === 'list' && view === 'details') ? 'on' : ''} onClick={() => goTo(n.id)}>
              <span>{n.icon}</span> {n.label}
              {n.id === 'mine' && mine.length > 0 && <i className="count">{mine.length}</i>}
            </button>
          ))}
        </nav>

        {view === 'details' && selected ? (
          <ParkingDetails
            key={selected.id + (presetHours || '')}
            parking={selected}
            spots={spotsById[selected.id]}
            stat={stats[selected.id]}
            reservedIds={reservedByParking[selected.id] || new Set()}
            myReservations={mine.filter((r) => r.parkingId === selected.id)}
            profile={profile}
            origin={origin}
            now={now}
            presetHours={presetHours}
            onBack={() => goTo('list')}
            onReserve={reserve}
            onCheckIn={checkIn}
            onCancel={cancel}
          />
        ) : view === 'mine' ? (
          <MyReservations reservations={mine} profile={profile} setProfile={setProfile} now={now}
            onCheckIn={checkIn} onCancel={cancel} onOpen={openParking} />
        ) : view === 'assistant' ? (
          <Assistant parkings={PARKINGS} stats={stats} origin={origin} onOpen={openParking} />
        ) : view === 'scanner' ? (
          <Scanner parkings={PARKINGS} stats={stats} onApply={applyScan} />
        ) : (
          <ParkingList
            parkings={filtered} allCount={PARKINGS.length} stats={stats} onSelect={openParking}
            origin={origin} setOrigin={setOrigin} onLocate={locate} onFindBest={findBest} locating={locating}
            filters={filters} setFilters={setFilters}
          />
        )}
      </aside>

      <main className="map-area">
        <ParkingMap parkings={filtered} stats={stats} selectedId={selectedId} onSelect={openParking} origin={origin} theme={theme} />
        <div className="map-legend">
          <span><i style={{ background: 'var(--green)' }} /> Има места</span>
          <span><i style={{ background: 'var(--yellow)' }} /> Малку</span>
          <span><i style={{ background: 'var(--red)' }} /> Полн</span>
          {live && <span className="live">● во живо</span>}
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
