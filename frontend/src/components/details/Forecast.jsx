import ForecastBar from './ForecastBar.jsx'
import { bestSlot, forecast } from '../../utils/forecast.js'
import { pad2 } from '../../utils/format.js'
import './forecast.css'

// Мал столбест график: колку слободни места се очекуваат во следните 12 часа
export default function Forecast({ parking, total }) {
  const fc = forecast(parking, total, 12)
  const best = bestSlot(fc)
  return (
    <section className="forecast">
      <div className="forecast__head">
        <h3>Предвидување (следни 12 ч)</h3>
        <span className="tag">AI проценка</span>
      </div>
      <div className="forecast__bars">
        {fc.map((slot, i) => <ForecastBar key={i} slot={slot} total={total} first={i === 0} best={slot === best} />)}
      </div>
      <p className="forecast__text">
        Најмалку гужва околу <b>{pad2(best.hour)}:00</b> (~{best.free} слободни места).
        Висината на столбот = слободни места.
      </p>
    </section>
  )
}
