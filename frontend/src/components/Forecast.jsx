import { forecast, bestSlot } from '../lib/forecast.js'
import { availability } from '../lib/spots.js'

// Мал столбест график: колку слободни места се очекуваат во следните 12 часа
export default function Forecast({ parking, total }) {
  const fc = forecast(parking, total, 12)
  const best = bestSlot(fc)
  const hh = (h) => `${String(h).padStart(2, '0')}h`
  return (
    <section className="forecast">
      <div className="forecast__head">
        <h3>Предвидување (следни 12 ч)</h3>
        <span className="tag">AI проценка</span>
      </div>
      <div className="forecast__bars">
        {fc.map((s, i) => {
          const a = availability(s.free, total)
          return (
            <div key={i} className={`fbar${s === best ? ' fbar--best' : ''}`} title={`${hh(s.hour)}: ~${s.free} слободни`}>
              <div className="fbar__track">
                <div className="fbar__fill" style={{ height: `${Math.max(4, (s.free / total) * 100)}%`, background: a.color }} />
              </div>
              <span>{i === 0 ? 'сега' : s.hour}</span>
            </div>
          )
        })}
      </div>
      <p className="forecast__text">
        Најмалку гужва околу <b>{String(best.hour).padStart(2, '0')}:00</b> (~{best.free} слободни места).
        Висината на столбот = слободни места.
      </p>
    </section>
  )
}
