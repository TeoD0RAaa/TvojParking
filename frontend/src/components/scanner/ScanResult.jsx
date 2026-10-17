import './scanner.css'

export default function ScanResult({ count, total, onApply }) {
  return (
    <div className="scan-result">
      <div className="dstats__big">{count}<small> коли</small></div>
      <p className="muted">од {total} места → {Math.max(0, total - count)} слободни</p>
      <button className="small primary" onClick={onApply}>Примени на паркингот</button>
    </div>
  )
}
