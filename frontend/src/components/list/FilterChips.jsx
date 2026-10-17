import Chip from '../common/Chip.jsx'
import { FILTERS_BY_ID } from '../../utils/filters.js'

// Вклучените филтри, по редот како се додадени. Клик на филтерот го трга.
export default function FilterChips({ filters, setFilters }) {
  if (!filters.length) return null
  const remove = (id) => setFilters((f) => f.filter((x) => x !== id))

  return (
    <div className="chips filter-chips">
      {filters.map((id) => <Chip key={id} on onClick={() => remove(id)}>{FILTERS_BY_ID[id].label} ×</Chip>)}
    </div>
  )
}
