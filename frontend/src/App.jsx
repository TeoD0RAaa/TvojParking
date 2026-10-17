import { useEffect, useMemo, useState } from 'react'
import ParkingMap from './components/ParkingMap.jsx'
import ParkingList from './components/ParkingList.jsx'
import ParkingDetails from './components/ParkingDetails.jsx'
import { PARKINGS } from './data/parkings.js'
import { buildSpots } from './lib/spots.js'

// Резервациите засега се чуваат во прелистувачот (localStorage)
const STORE_KEY = 'tvojparking.reservations'
function loadReservations() {
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY)) || []
    return all.filter((r) => r.until > Date.now()) // истечените се бришат
  } catch { return [] }
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [reservations, setReservations] = useState(loadReservations)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(reservations)) } catch {}
  }, [reservations])

  // места за секој паркинг (се прават еднаш)
  const spotsById = useMemo(() => Object.fromEntries(PARKINGS.map((p) => [p.id, buildSpots(p)])), [])

  // колку слободни / вкупно има секој паркинг, со твоите резервации одземени
  const stats = useMemo(() => {
    const out = {}
    for (const p of PARKINGS) {
      const spots = spotsById[p.id]
      const mine = reservations.filter((r) => r.parkingId === p.id).length
      out[p.id] = { total: spots.length, free: spots.filter((s) => !s.taken).length - mine }
    }
    return out
  }, [spotsById, reservations])

  const selected = PARKINGS.find((p) => p.id === selectedId)

  const reserve = ({ spotId, plate, hours }) => {
    const r = { id: crypto.randomUUID(), parkingId: selectedId, spotId, plate, hours, until: Date.now() + hours * 3600_000 }
    setReservations((list) => [...list, r])
    setToast(`Резервирано: ${selected.name}, место ${spotId} ✓`)
    setTimeout(() => setToast(null), 3000)
  }
  const cancel = (id) => setReservations((list) => list.filter((r) => r.id !== id))

  return (
    <div className="app">
      <aside className="panel">
        <header className="brand">
          <span className="brand__logo">P</span>
          <span>Tvoj<b>Parking</b></span>
        </header>
        {selected ? (
          <ParkingDetails
            key={selected.id}
            parking={selected}
            spots={spotsById[selected.id]}
            myReservations={reservations.filter((r) => r.parkingId === selected.id)}
            onBack={() => setSelectedId(null)}
            onReserve={reserve}
            onCancel={cancel}
          />
        ) : (
          <ParkingList parkings={PARKINGS} stats={stats} onSelect={setSelectedId} />
        )}
      </aside>

      <main className="map-area">
        <ParkingMap parkings={PARKINGS} stats={stats} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="map-legend">
          <span><i style={{ background: 'var(--green)' }} /> Има места</span>
          <span><i style={{ background: 'var(--yellow)' }} /> Малку места</span>
          <span><i style={{ background: 'var(--red)' }} /> Полн</span>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
