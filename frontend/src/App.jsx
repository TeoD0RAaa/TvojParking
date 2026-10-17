import SkopjeMap from './SkopjeMap.jsx'
import { PARKINGS } from './parkings.js'

export default function App() {
  return (
    <main className="container">
      <h1>TvojParking</h1>
      <div className="map-wrap">
        <SkopjeMap parkings={PARKINGS} />
      </div>
      <p className="hint">Кликни на <b>P</b> за да видиш колку места има 🚗</p>
    </main>
  )
}
