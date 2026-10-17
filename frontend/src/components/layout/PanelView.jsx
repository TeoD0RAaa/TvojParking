import ParkingList from '../list/ParkingList.jsx'
import ParkingDetails from '../details/ParkingDetails.jsx'
import MyReservations from '../reservations/MyReservations.jsx'
import Assistant from '../assistant/Assistant.jsx'

// Содржината на левиот панел според отворениот таб
export default function PanelView({ view, details, mine, assistant, list }) {
  if (view === 'details' && details) return <ParkingDetails key={details.parking.id + (details.presetHours || '')} {...details} />
  if (view === 'mine') return <MyReservations {...mine} />
  if (view === 'assistant') return <Assistant {...assistant} />
  return <ParkingList {...list} />
}
