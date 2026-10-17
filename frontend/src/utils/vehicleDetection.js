/*
  AI детекција на коли: моделот COCO-SSD (TensorFlow.js) ги наоѓа колите директно во прелистувачот.
  Моделот (~20 MB) се симнува од интернет првиот пат.
*/
const VEHICLES = new Set(['car', 'truck', 'bus', 'motorcycle'])
const BOX_COLOR = '#22a45d'

let modelPromise = null
function loadModel() {
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

// Ги враќа само возилата на сликата
export async function detectVehicles(img) {
  const model = await loadModel()
  return (await model.detect(img, 100, 0.3)).filter((p) => VEHICLES.has(p.class))
}

// Нацртај нумерирани рамки околу колите
export function drawBoxes(canvas, img, preds) {
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  const fontSize = Math.max(14, canvas.width / 50)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.lineWidth = Math.max(2, canvas.width / 300)
  ctx.strokeStyle = BOX_COLOR
  ctx.fillStyle = BOX_COLOR
  ctx.font = `${fontSize}px Inter, sans-serif`
  preds.forEach((p, i) => {
    const [x, y, w, h] = p.bbox
    ctx.strokeRect(x, y, w, h)
    ctx.fillText(`${i + 1}`, x + 4, y + fontSize)
  })
}
