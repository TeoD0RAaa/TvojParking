import { useMemo, useState } from 'react'
import Panel from './components/layout/Panel.jsx'
import Toast from './components/layout/Toast.jsx'
import ParkingMap from './components/map/ParkingMap.jsx'
import MapLegend from './components/map/MapLegend.jsx'
import ParkingList from './components/list/ParkingList.jsx'
import ParkingDetails from './components/details/ParkingDetails.jsx'
import { useReservations } from './hooks/useReservations.js'
import { useToast } from './hooks/useToast.js'
import { PARKINGS } from './data/parkings.js'
import { buildSpots } from './utils/spots.js'
import { buildStats } from './utils/stats.js'
import { reservationsFor } from './utils/reservations.js'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const { reservations, reserve, cancel } = useReservations()
  const [toast, showToast] = useToast()

  // места за секој паркинг (се прават еднаш)
  const spotsById = useMemo(() => Object.fromEntries(PARKINGS.map((p) => [p.id, buildSpots(p)])), [])
  const stats = useMemo(() => buildStats(PARKINGS, spotsById, reservations), [spotsById, reservations])
  const selected = PARKINGS.find((p) => p.id === selectedId)

  const handleReserve = ({ spotId, plate, hours }) => {
    reserve({ parkingId: selected.id, spotId, plate, hours })
    showToast(`Резервирано: ${selected.name}, место ${spotId} ✓`)
  }

  return (
    <div className="app">
      <Panel>
        {selected ? (
          <ParkingDetails
            key={selected.id}
            parking={selected}
            spots={spotsById[selected.id]}
            myReservations={reservationsFor(reservations, selected.id)}
            onBack={() => setSelectedId(null)}
            onReserve={handleReserve}
            onCancel={cancel}
          />
        ) : (
          <ParkingList parkings={PARKINGS} stats={stats} onSelect={setSelectedId} />
        )}
      </Panel>

      <main className="map-area">
        <ParkingMap parkings={PARKINGS} stats={stats} selectedId={selectedId} onSelect={setSelectedId} />
        <MapLegend />
      </main>

      <Toast message={toast} />
    </div>
  )
}
