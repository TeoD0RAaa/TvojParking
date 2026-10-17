import { useState } from 'react'
import DetailsHeader from './DetailsHeader.jsx'
import AvailabilityCard from './AvailabilityCard.jsx'
import DirectionsRow from './DirectionsRow.jsx'
import Forecast from './Forecast.jsx'
import ReservationsHere from './ReservationsHere.jsx'
import SpotLegend from './SpotLegend.jsx'
import SpotBlock from './SpotBlock.jsx'
import ReserveForm from './ReserveForm.jsx'
import { spotsInBlock } from '../../utils/spots.js'

export default function ParkingDetails({
  parking, spots, stat, reservedIds, myReservations, profile, origin, now, presetHours,
  onBack, onReserve, onCheckIn, onCancel,
}) {
  const [selectedSpot, setSelectedSpot] = useState(null)

  const mySpotIds = new Set(myReservations.map((r) => r.spotId))
  const spot = spots.find((s) => s.id === selectedSpot)

  const toggleSpot = (id) => setSelectedSpot((current) => (current === id ? null : id))
  const reserve = async (data) => {
    await onReserve({ spotId: selectedSpot, ...data })
    setSelectedSpot(null)
  }

  return (
    <div className="panel-body">
      <DetailsHeader parking={parking} onBack={onBack} />
      <AvailabilityCard parking={parking} stat={stat} />
      <DirectionsRow parking={parking} origin={origin} />
      <Forecast parking={parking} total={stat.total} />
      <ReservationsHere reservations={myReservations} parking={parking} now={now} onCheckIn={onCheckIn} onCancel={onCancel} />
      <SpotLegend />

      {parking.blocks.map((b) => (
        <SpotBlock
          key={b.name}
          block={b}
          spots={spotsInBlock(spots, b.name)}
          states={{ mySpotIds, reservedIds, selectedSpot }}
          onToggle={toggleSpot}
        />
      ))}

      <ReserveForm
        full={stat.free <= 0}
        spot={spot}
        pricePerHour={parking.pricePerHour}
        profile={profile}
        presetHours={presetHours}
        onReserve={reserve}
      />
    </div>
  )
}
