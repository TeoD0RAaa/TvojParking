import { useState } from 'react'
import DetailsHeader from './DetailsHeader.jsx'
import AvailabilityCard from './AvailabilityCard.jsx'
import SpotLegend from './SpotLegend.jsx'
import SpotBlock from './SpotBlock.jsx'
import MyReservations from './MyReservations.jsx'
import ReserveForm from './ReserveForm.jsx'
import { freeSpotCount, spotsInBlock } from '../../utils/spots.js'

export default function ParkingDetails({ parking, spots, myReservations, onBack, onReserve, onCancel }) {
  const [selectedSpot, setSelectedSpot] = useState(null)

  const mySpotIds = new Set(myReservations.map((r) => r.spotId))
  const free = freeSpotCount(spots, mySpotIds)

  const toggleSpot = (id) => setSelectedSpot((current) => (current === id ? null : id))
  const reserve = ({ plate, hours }) => {
    onReserve({ spotId: selectedSpot, plate, hours })
    setSelectedSpot(null)
  }

  return (
    <div className="panel-body">
      <DetailsHeader parking={parking} onBack={onBack} />
      <AvailabilityCard free={free} total={spots.length} />
      <SpotLegend />

      {parking.blocks.map((b) => (
        <SpotBlock
          key={b.name}
          block={b}
          spots={spotsInBlock(spots, b.name)}
          mySpotIds={mySpotIds}
          selectedSpot={selectedSpot}
          onToggle={toggleSpot}
        />
      ))}

      <MyReservations reservations={myReservations} onCancel={onCancel} />
      <ReserveForm full={free === 0} spotId={selectedSpot} pricePerHour={parking.pricePerHour} onReserve={reserve} />
    </div>
  )
}
