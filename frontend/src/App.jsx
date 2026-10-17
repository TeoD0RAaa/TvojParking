import { useMemo, useState } from 'react'
import Header from './components/layout/Header.jsx'
import Tabs from './components/layout/Tabs.jsx'
import PanelView from './components/layout/PanelView.jsx'
import Toast from './components/layout/Toast.jsx'
import ParkingMap from './components/map/ParkingMap.jsx'
import MapLegend from './components/map/MapLegend.jsx'
import { useTheme } from './hooks/useTheme.js'
import { useProfile } from './hooks/useProfile.js'
import { useApiMode } from './hooks/useApiMode.js'
import { useNow } from './hooks/useNow.js'
import { useReservations } from './hooks/useReservations.js'
import { useLiveSimulation } from './hooks/useLiveSimulation.js'
import { useOrigin } from './hooks/useOrigin.js'
import { useNavigation } from './hooks/useNavigation.js'
import { useToast } from './hooks/useToast.js'
import { PARKINGS, PARKINGS_BY_ID } from './data/parkings.js'
import { buildStats } from './utils/stats.js'
import { applyFilters, DEFAULT_FILTERS } from './utils/filters.js'
import { nearestParking } from './utils/geo.js'
import { MAX_HOURS } from './utils/api/index.js'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [profile, setProfile] = useProfile()
  const mode = useApiMode()
  const now = useNow()
  const { mine, reservedByParking, create, checkIn, cancel } = useReservations(mode, profile, now)
  const { spotsById, releaseSpot } = useLiveSimulation(PARKINGS, reservedByParking)
  const { origin, setOrigin, locating, locate } = useOrigin()
  const { view, selectedId, openParking, goTo } = useNavigation()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [toast, flash] = useToast()

  const stats = useMemo(() => buildStats(PARKINGS, spotsById, reservedByParking), [spotsById, reservedByParking])
  const filtered = useMemo(() => applyFilters(PARKINGS, stats, filters), [stats, filters])
  const selected = PARKINGS_BY_ID[selectedId]

  const findBest = async () => {
    const o = await locate()
    const candidates = filtered.filter((p) => stats[p.id].free > 0)
    if (!candidates.length) return flash('Нема слободен паркинг со овие филтри 😕')
    const best = nearestParking(o, candidates)
    openParking(best.id)
    flash(`Најблизок слободен: ${best.name}`)
  }

  // нема бирање часови: местото е твое до MAX_HOURS, а се наплаќа по поминати часови (billedHours)
  const reserve = async ({ spotId, plate, name, graceMin }) => {
    if (!profile || profile.name !== name || profile.plate !== plate) setProfile({ name, plate })
    await create({ parkingId: selectedId, spotId, plate, user: name, hours: MAX_HOURS, graceMin })
    releaseSpot(selectedId, spotId)
    flash(`Резервирано: место ${spotId} ✓  Имаш ${graceMin} мин да стигнеш`)
  }
  const handleCheckIn = async (id) => { await checkIn(id); flash('Добредојде! Паркиран си ✓') }
  const handleCancel = async (id) => { await cancel(id); flash('Резервацијата е откажана') }

  return (
    <div className="app">
      <aside className="panel">
        <Header mode={mode} theme={theme} onToggleTheme={toggleTheme} />
        <Tabs view={view} mineCount={mine.length} onChange={goTo} />
        <PanelView
          view={view}
          details={selected && {
            parking: selected, spots: spotsById[selected.id], stat: stats[selected.id],
            reservedIds: reservedByParking[selected.id] || new Set(),
            myReservations: mine.filter((r) => r.parkingId === selected.id),
            profile, origin, now,
            onBack: () => goTo('list'), onReserve: reserve, onCheckIn: handleCheckIn, onCancel: handleCancel,
          }}
          mine={{ reservations: mine, profile, setProfile, now, onCheckIn: handleCheckIn, onCancel: handleCancel, onOpen: openParking }}
          assistant={{ parkings: PARKINGS, stats, origin, mode, onOpen: openParking }}
          list={{
            parkings: filtered, allCount: PARKINGS.length, stats, onSelect: openParking,
            origin, setOrigin, onLocate: locate, onFindBest: findBest, locating, filters, setFilters,
          }}
        />
      </aside>

      <main className="map-area">
        <ParkingMap parkings={filtered} stats={stats} selectedId={selectedId} onSelect={openParking} origin={origin} theme={theme} />
        <MapLegend />
      </main>

      <Toast message={toast} />
    </div>
  )
}
