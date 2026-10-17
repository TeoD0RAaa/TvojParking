import './spots.css'

export default function SpotLegend() {
  return (
    <div className="legend">
      <span><i className="spot spot--free" /> слободно</span>
      <span><i className="spot spot--taken" /> зафатено</span>
      <span><i className="spot spot--mine" /> твое</span>
      <span>♿ ⚡ посебни</span>
    </div>
  )
}
