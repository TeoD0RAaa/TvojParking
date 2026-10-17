import ListSummary from './ListSummary.jsx'
import ParkingListItem from './ParkingListItem.jsx'
import { sortByFree, totalFree } from '../../utils/stats.js'
import './list.css'

export default function ParkingList({ parkings, stats, onSelect }) {
  return (
    <div className="panel-body">
      <ListSummary count={parkings.length} free={totalFree(parkings, stats)} />
      <ul className="plist">
        {sortByFree(parkings, stats).map((p) => (
          <ParkingListItem key={p.id} parking={p} stat={stats[p.id]} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  )
}
