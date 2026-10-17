import './reserve.css'

const DURATIONS = [1, 2, 3, 4]

export default function DurationPicker({ value, onChange }) {
  return (
    <div className="durations">
      {DURATIONS.map((h) => (
        <button type="button" key={h} className={h === value ? 'on' : ''} onClick={() => onChange(h)}>{h} ч</button>
      ))}
    </div>
  )
}
