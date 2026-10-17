import { useState } from 'react'
import DetailsHeader from './DetailsHeader.jsx'
import AvailabilityCard from './AvailabilityCard.jsx'
import DirectionsRow from './DirectionsRow.jsx'
import Forecast from './Forecast.jsx'
import ReservationsHere from './ReservationsHere.jsx'
import SpotLegend from './SpotLegend.jsx'
import SpotGrid from './SpotGrid.jsx'
import ReserveForm from './ReserveForm.jsx'
import { nextFreeSpot } from '../../utils/spots.js'

export default function ParkingDetails({
  parking, spots, stat, reservedIds, myReservations, profile, origin, now, presetHours,
  onBack, onReserve, onCheckIn, onCancel,
}) {
  // каков вид место ти треба: обично / ♿ / ⚡ — самото место го доделува системот по ред
  const [kind, setKind] = useState('normal')
  const mySpotIds = new Set(myReservations.map((r) => r.spotId))
  const next = nextFreeSpot(spots, reservedIds, kind)

  // го резервира следното слободно место по ред (се бара повторно во моментот на клик)
  const reserve = async (data) => {
    const spot = nextFreeSpot(spots, reservedIds, kind)
    if (!spot) throw new Error('Нема повеќе слободни места од овој вид.')
    await onReserve({ spotId: spot.id, ...data })
  }

  return (
    <div className="panel-body">
      <DetailsHeader parking={parking} onBack={onBack} />
      <AvailabilityCard parking={parking} stat={stat} />
      <DirectionsRow parking={parking} origin={origin} />
      <Forecast parking={parking} total={stat.total} free={stat.free} />
      <ReservationsHere reservations={myReservations} parking={parking} now={now} onCheckIn={onCheckIn} onCancel={onCancel} />
      <SpotLegend />

      <SpotGrid spots={spots} states={{ mySpotIds, reservedIds, nextId: next?.id }} />

      <ReserveForm
        parking={parking}
        kind={kind}
        setKind={setKind}
        next={next}
        stat={stat}
        pricePerHour={parking.pricePerHour}
        profile={profile}
        presetHours={presetHours}
        onReserve={reserve}
      />
    </div>
  )
}
