import AddFilter from './AddFilter.jsx'
import FilterChips from './FilterChips.jsx'
import OriginNote from './OriginNote.jsx'
import ListSummary from './ListSummary.jsx'
import ParkingListItem from './ParkingListItem.jsx'
import { sortForList, totalFree } from '../../utils/stats.js'
import './list.css'

export default function ParkingList({ parkings, allCount, stats, onSelect, origin, setOrigin, onLocate, onFindBest, locating, filters, setFilters }) {
  const sorted = sortForList(parkings, stats, origin)

  return (
    <div className="panel-body">
      <button className="find-btn" onClick={onFindBest} disabled={locating}>
        {locating ? 'Те барам…' : '🧭 Најди ми паркинг'}
      </button>

      <div className="search">
        <AddFilter filters={filters} setFilters={setFilters} />
        <button className="icon-btn" onClick={onLocate} title="Моја локација">📍</button>
      </div>
      <FilterChips filters={filters} setFilters={setFilters} />
      <OriginNote origin={origin} onClear={() => setOrigin(null)} />
      <ListSummary count={parkings.length} allCount={allCount} free={totalFree(parkings, stats)} />

      {sorted.length === 0 && <p className="empty">Нема паркинг со овие филтри.</p>}
      <ul className="plist">
        {sorted.map(({ p, km }) => (
          <ParkingListItem key={p.id} parking={p} stat={stats[p.id]} km={km} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  )
}
