import ForecastBar from './ForecastBar.jsx'
import { bestSlot, forecast } from '../../utils/forecast.js'
import { pad2 } from '../../utils/format.js'
import './forecast.css'

// Мал столбест график: колку слободни места се очекуваат во следните 12 часа
export default function Forecast({ parking, total, free }) {
  const fc = forecast(parking, total, 12, { free })
  const best = bestSlot(fc)
  return (
    <section className="forecast">
      <div className="forecast__head">
        <h3>Предвидување (следни 12 ч)</h3>
        <span className="tag" title="Просек по час за овој тип паркинг, коригиран со сегашната состојба">Статистичка проценка</span>
      </div>
      <div className="forecast__bars">
        {fc.map((slot, i) => <ForecastBar key={i} slot={slot} total={total} first={i === 0} best={slot === best} />)}
      </div>
      <p className="forecast__text">
        Најмалку гужва околу <b>{pad2(best.hour)}:00</b> (~{best.free} слободни места{best.error > 0 && <> ± {best.error}</>}).
        Висината на столбот = слободни места.
      </p>
      <details className="forecast__how">
        <summary>Како се пресметува?</summary>
        <p>
          Почнуваме од <b>просечната зафатеност за секој час</b> за ваков тип паркинг (центар, болница, парк, станбено),
          со посебен фактор за викенд (и за летната сезона во Охрид и Струга). Потоа ја гледаме <b>сегашната состојба</b>: ако сега е пополно од просекот,
          таа разлика ја пренесуваме и во следните часови, но таа се намалува со текот на времето
          (по ~2 часа останува уште ⅓ од неа). Бројот „±“ е очекуваната грешка — расте колку подалеку гледаме.
        </p>
      </details>
    </section>
  )
}
