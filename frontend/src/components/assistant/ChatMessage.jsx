import ParkingPick from './ParkingPick.jsx'

// Една порака во разговорот; одговорот на ботот може да има предлог-паркинзи
export default function ChatMessage({ message, stats, onOpen }) {
  return (
    <div className={`msg msg--${message.from}`}>
      <p>{message.text}</p>
      {message.note && <small className="msg__note">{message.note}</small>}
      {message.picks?.length > 0 && (
        <div className="msg__picks">
          {message.picks.map((id) => (
            <ParkingPick key={id} id={id} stat={stats[id]} onClick={() => onOpen(id)} />
          ))}
        </div>
      )}
    </div>
  )
}
