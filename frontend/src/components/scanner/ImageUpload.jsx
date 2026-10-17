import './scanner.css'

// Избор на слика + приказ со платно (canvas) за рамките околу колите
export default function ImageUpload({ imgUrl, onFile, imgRef, canvasRef }) {
  const change = (e) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <>
      <label className="upload">
        <input type="file" accept="image/*" onChange={change} />
        {imgUrl ? 'Смени слика' : '＋ Избери слика'}
      </label>
      {imgUrl && (
        <div className="scan">
          <img ref={imgRef} src={imgUrl} alt="Паркинг" crossOrigin="anonymous" />
          <canvas ref={canvasRef} />
        </div>
      )}
    </>
  )
}
