import { FILTERS, addFilter } from '../../utils/filters.js'

// „+ Додај филтер“: филтрите се додаваат еден по еден
export default function AddFilter({ filters, setFilters }) {
  const available = FILTERS.filter((f) => !filters.includes(f.id))

  return (
    <select value="" onChange={(e) => setFilters((f) => addFilter(f, e.target.value))}>
      <option value="">+ Додај филтер</option>
      {available.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
    </select>
  )
}
