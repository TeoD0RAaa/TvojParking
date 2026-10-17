import { useRef, useState } from 'react'

/*
  AI скенер: качуваш слика од паркинг, моделот COCO-SSD (TensorFlow.js) ги наоѓа колите
  директно во прелистувачот, и бројот може да се примени на паркингот.
  Моделот (~20 MB) се симнува од интернет првиот пат.
*/
const VEHICLES = new Set(['car', 'truck', 'bus', 'motorcycle'])
let modelPromise = null
async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import('@tensorflow/tfjs')
      const cocoSsd = await import('@tensorflow-models/coco-ssd')
      return cocoSsd.load({ base: 'mobilenet_v2' })
    })()
    modelPromise.catch(() => { modelPromise = null })
  }
  return modelPromise
}

export default function Scanner({ parkings, stats, onApply }) {
  const [parkingId, setParkingId] = useState(parkings[0].id)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [count, setCount] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const imgRef = useRef(null)
  const canvasRef = useRef(null)
  const total = stats[parkingId].total

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCount(null); setStatus('idle')
    setImgUrl(URL.createObjectURL(file))
  }

  const detect = async () => {
    setStatus('loading')
    try {
      const model = await loadModel()
      const img = imgRef.current
      const preds = (await model.detect(img, 100, 0.3)).filter((p) => VEHICLES.has(p.class))
      // нацртај рамки околу колите
      const c = canvasRef.current
      c.width = img.naturalWidth; c.height = img.naturalHeight
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.lineWidth = Math.max(2, c.width / 300)
      ctx.strokeStyle = '#22a45d'
      ctx.fillStyle = '#22a45d'
      ctx.font = `${Math.max(14, c.width / 50)}px Inter, sans-serif`
      preds.forEach((p, i) => {
        const [x, y, w, h] = p.bbox
        ctx.strokeRect(x, y, w, h)
        ctx.fillText(`${i + 1}`, x + 4, y + Math.max(14, c.width / 50))
      })
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

      <label className="upload">
        <input type="file" accept="image/*" onChange={onFile} />
        {imgUrl ? 'Смени слика' : '＋ Избери слика'}
      </label>

      {imgUrl && (
        <div className="scan">
          <img ref={imgRef} src={imgUrl} alt="Паркинг" crossOrigin="anonymous" />
          <canvas ref={canvasRef} />
        </div>
      )}

      {imgUrl && (
        <button className="cta" onClick={detect} disabled={status === 'loading'}>
          {status === 'loading' ? 'Анализирам… (првиот пат се симнува моделот)' : 'Изброј коли'}
        </button>
      )}

      {status === 'error' && <p className="error">Не успеав да го вчитам моделот. Провери дали имаш интернет.</p>}
      {status === 'done' && (
        <div className="scan-result">
          <div className="dstats__big">{count}<small> коли</small></div>
          <p className="muted">од {total} места → {Math.max(0, total - count)} слободни</p>
          <button className="small primary" onClick={() => onApply(parkingId, Math.min(count, total))}>
            Примени на паркингот
          </button>
        </div>
      )}
    </div>
  )
}
