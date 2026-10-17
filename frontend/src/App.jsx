import { useMemo, useState } from 'react'
import Login from './components/auth/Login.jsx'
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
import { useAuth } from './hooks/useAuth.js'
import { useWallet } from './hooks/useWallet.js'
import { useCity } from './hooks/useCity.js'
import { CITIES } from './data/cities.js'
import { chargeCard } from './utils/payment.js'
import { PARKINGS, PARKINGS_BY_ID } from './data/parkings.js'
import { buildStats } from './utils/stats.js'
import { applyFilters, DEFAULT_FILTERS } from './utils/filters.js'
import { nearestCity, nearestParking } from './utils/geo.js'
import { MAX_HOURS, billedHours } from './utils/api/index.js'

// Прво најава (демо), па апликацијата. key={user.id} -> паричникот се вчитува за тој корисник.
export default function App() {
  const { user, login, logout } = useAuth()
  if (!user) return <Login onLogin={login} />
  return <ParkingApp key={user.id} user={user} onLogout={logout} />
}

function ParkingApp({ user, onLogout }) {
  const [theme, toggleTheme] = useTheme()
  const [profile, setProfile] = useProfile()
  const mode = useApiMode()
  const now = useNow()
  const { mine, reservedByParking, create, checkIn, cancel } = useReservations(mode, profile, now)
  const { spotsById, releaseSpot } = useLiveSimulation(PARKINGS, reservedByParking)
  const { origin, setOrigin, locating, locate } = useOrigin()
  const { view, selectedId, openParking, goTo } = useNavigation()
  const [city, setCity] = useCity()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [toast, flash] = useToast()
  const wallet = useWallet(user)

  const stats = useMemo(() => buildStats(PARKINGS, spotsById, reservedByParking), [spotsById, reservedByParking])
  // само паркинзите во избраниот град (симулацијата и статистиките работат за сите градови)
  const cityParkings = useMemo(() => (city.id === 'all' ? PARKINGS : PARKINGS.filter((p) => p.city === city.id)), [city.id])
  const filtered = useMemo(() => applyFilters(cityParkings, stats, filters), [cityParkings, stats, filters])
  const selected = PARKINGS_BY_ID[selectedId]

  // Смена на град: локацијата „каде одиш“ од стариот град повеќе не важи
  const changeCity = (id) => {
    if (id === city.id) return
    setCity(id)
    setOrigin(null)
    goTo('list')
  }

  // Отвори паркинг од кој било град (асистент, „Мои“, пребарување) — градот се менува сам
  const openAny = (id) => {
    const p = PARKINGS_BY_ID[id]
    if (p && city.id !== 'all' && p.city !== city.id) { setCity(p.city); setOrigin(null) }
    openParking(id)
  }

  // Каде сум? -> најблискиот град (ако не може да те лоцира, останува сегашниот)
  // keepAll: во режим „Цела Македонија“ само подреди по растојание, не менувај град
  const locateCity = async (keepAll = false) => {
    const o = await locate(city)
    if (o.fallback) { flash('Не можам да те лоцирам — остануваш во ' + city.name); return { o, cityId: city.id } }
    if (keepAll && city.id === 'all') return { o, cityId: 'all' }
    const nc = nearestCity(o, CITIES)
    if (nc.id !== city.id) { setCity(nc.id); flash(`Те најдов во ${nc.name} 📍`) }
    return { o, cityId: nc.id }
  }

  const findBest = async () => {
    const { o, cityId } = await locateCity()
    const pool = applyFilters(cityId === 'all' ? PARKINGS : PARKINGS.filter((p) => p.city === cityId), stats, filters)
    const candidates = pool.filter((p) => stats[p.id].free > 0)
    if (!candidates.length) return flash('Нема слободен паркинг со овие филтри 😕')
    const best = nearestParking(o, candidates)
    openParking(best.id)
    flash(`Најблизок слободен: ${best.name}`)
  }

  // 1) наплата на првиот час од картичката (демо)  2) резервација  3) запис во историјата на плаќања
  // Нема бирање часови: местото е твое до MAX_HOURS, а останатите часови се доплаќаат на крај (endParking)
  const reserve = async ({ spotId, plate, name, graceMin }) => {
    if (!wallet.card) throw new Error('Додај картичка за да резервираш.')
    if (!profile || profile.name !== name || profile.plate !== plate) setProfile({ name, plate })
    const amount = selected.pricePerHour
    const charge = await chargeCard(wallet.card, amount)
    const r = await create({ parkingId: selectedId, spotId, plate, user: name, hours: MAX_HOURS, graceMin })
    wallet.addPayment({ id: charge.id, reservationId: r.id, parkingId: selectedId, spotId, amount, card: charge.card })
    releaseSpot(selectedId, spotId)
    flash(`Платено ${amount} ден за првиот час ✓  Место ${spotId} · имаш ${graceMin} мин да стигнеш`)
  }
  const saveCard = (c) => { wallet.setCard(c); flash(`Картичката ${c.brand} •••• ${c.last4} е зачувана ✓`) }
  const handleCheckIn = async (id) => { await checkIn(id); flash('Добредојде! Паркиран си ✓') }

  // Пред пристигнување -> откажување, парите се враќаат. По пристигнување -> крај на паркирањето,
  // се доплаќаат часовите по првиот (првиот е платен при резервација).
  const handleCancel = async (id) => {
    const r = mine.find((x) => x.id === id)
    await cancel(id)
    if (!r?.checkedIn) {
      const back = wallet.refund(id)
      return flash(back ? `Откажано · вратени ${back} ден на картичката` : 'Резервацијата е откажана')
    }
    const hours = billedHours(r)
    const extra = (hours - 1) * PARKINGS_BY_ID[r.parkingId].pricePerHour
    if (extra > 0 && wallet.card) {
      const charge = await chargeCard(wallet.card, extra)
      wallet.addPayment({ id: charge.id, reservationId: r.id, parkingId: r.parkingId, spotId: r.spotId, amount: extra, card: charge.card })
    }
    flash(extra > 0 ? `Паркирањето заврши · ${hours} ч · доплатени ${extra} ден` : 'Паркирањето заврши · 1 ч (веќе платен)')
  }

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
            profile, origin, now, card: wallet.card, onSaveCard: saveCard,
            onBack: () => goTo('list'), onReserve: reserve, onCheckIn: handleCheckIn, onCancel: handleCancel,
          }}
          mine={{
            reservations: mine, profile, setProfile, now, onCheckIn: handleCheckIn, onCancel: handleCancel, onOpen: openAny,
            user, onLogout, card: wallet.card, onSaveCard: saveCard, onRemoveCard: wallet.removeCard, payments: wallet.payments,
          }}
          assistant={{ parkings: PARKINGS, cityParkings, city, stats, origin, mode, onOpen: openAny }}
          list={{
            parkings: filtered, allCount: cityParkings.length, stats, onSelect: openAny,
            origin, setOrigin, onLocate: () => locateCity(true), onFindBest: findBest, locating, filters, setFilters,
            city, setCity: changeCity, onNearestCity: () => locateCity(),
          }}
        />
      </aside>

      <main className="map-area">
        <ParkingMap parkings={filtered} stats={stats} selectedId={selectedId} onSelect={openAny} origin={origin} city={city} theme={theme} />
        <MapLegend />
      </main>

      <Toast message={toast} />
    </div>
  )
}
