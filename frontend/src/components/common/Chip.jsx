export default function Chip({ on, onClick, children }) {
  return <button className={`chip${on ? ' chip--on' : ''}`} onClick={onClick}>{children}</button>
}
