import { useRef, useState } from 'react'
import ImageUpload from './ImageUpload.jsx'
import ScanResult from './ScanResult.jsx'
import { detectVehicles, drawBoxes } from '../../utils/vehicleDetection.js'
import './scanner.css'

// AI скенер: качуваш слика од паркинг, моделот ги брои колите и бројот може да се примени на паркингот
export default function Scanner({ parkings, stats, onApply }) {
  const [parkingId, setParkingId] = useState(parkings[0].id)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [count, setCount] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const imgRef = useRef(null)
  const canvasRef = useRef(null)
  const total = stats[parkingId].total

  const onFile = (file) => {
    setCount(null); setStatus('idle')
    setImgUrl(URL.createObjectURL(file))
  }

  const detect = async () => {
    setStatus('loading')
    try {
      const preds = await detectVehicles(imgRef.current)
      drawBoxes(canvasRef.current, imgRef.current, preds)
      setCount(preds.length)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="panel-body">
      <h2 className="dname">AI скенер 📷</h2>
      <p className="dmeta">Качи слика од паркинг (од камера или телефон). Моделот ги брои колите и го ажурира бројот на зафатени места.</p>

      <label className="field">Паркинг
        <select value={parkingId} onChange={(e) => { setParkingId(e.target.value); setCount(null) }}>
          {parkings.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      <ImageUpload imgUrl={imgUrl} onFile={onFile} imgRef={imgRef} canvasRef={canvasRef} />

      {imgUrl && (
        <button className="cta" onClick={detect} disabled={status === 'loading'}>
          {status === 'loading' ? 'Анализирам… (првиот пат се симнува моделот)' : 'Изброј коли'}
        </button>
      )}

      {status === 'error' && <p className="error">Не успеав да го вчитам моделот. Провери дали имаш интернет.</p>}
      {status === 'done' && <ScanResult count={count} total={total} onApply={() => onApply(parkingId, Math.min(count, total))} />}
    </div>
  )
}
