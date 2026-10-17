import OriginPicker from './OriginPicker.jsx'
import CityPicker from './CityPicker.jsx'
import AddFilter from './AddFilter.jsx'
import FilterChips from './FilterChips.jsx'
import ListSummary from './ListSummary.jsx'
import ParkingListItem from './ParkingListItem.jsx'
import { sortForList, totalFree } from '../../utils/stats.js'
import { CITIES, CITIES_BY_ID } from '../../data/cities.js'
import './list.css'

const CITY_ORDER = Object.fromEntries(CITIES.map((c, i) => [c.id, i]))

export default function ParkingList({
  parkings, allCount, stats, onSelect, origin, setOrigin, onLocate, onFindBest, locating, filters, setFilters,
  city, setCity, onNearestCity,
}) {
  const allMode = city.id === 'all'
  // „Цела Македонија“ без локација: групирано по град (Скопје, Битола, Охрид…), во секој град по слободни места
  const grouped = allMode && !origin
  const sorted = grouped
    ? sortForList(parkings, stats, null).sort((a, b) => CITY_ORDER[a.p.city] - CITY_ORDER[b.p.city])
    : sortForList(parkings, stats, origin)

  return (
    <div className="panel-body">
      <CityPicker city={city} setCity={setCity} stats={stats} onNearest={onNearestCity} locating={locating} />
      <button className="find-btn" onClick={onFindBest} disabled={locating}>
        {locating ? 'Те барам…' : '🧭 Најди ми паркинг'}
      </button>

      <OriginPicker origin={origin} setOrigin={setOrigin} onLocate={onLocate} locating={locating} city={city} setCity={setCity} onSelect={onSelect} />
      <div className="search">
        <AddFilter filters={filters} setFilters={setFilters} />
      </div>
      <FilterChips filters={filters} setFilters={setFilters} />
      <ListSummary count={parkings.length} allCount={allCount} free={totalFree(parkings, stats)} />

      {sorted.length === 0 && <p className="empty">{allMode ? 'Нема паркинг со овие филтри.' : `Нема паркинг во ${city.name} со овие филтри.`}</p>}
      <ul className="plist">
        {sorted.map(({ p, km }, i) => (
          <ParkingGroup key={p.id} header={grouped && (i === 0 || sorted[i - 1].p.city !== p.city) ? CITIES_BY_ID[p.city].name : null}>
            <ParkingListItem parking={p} stat={stats[p.id]} km={km} onSelect={onSelect} showCity={allMode && !grouped} />
          </ParkingGroup>
        ))}
      </ul>
    </div>
  )
}

// Наслов на град пред првиот паркинг од тој град (само во „Цела Македонија“)
function ParkingGroup({ header, children }) {
  return header ? <>{<li className="plist__city">{header}</li>}{children}</> : children
}
