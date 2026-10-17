import { LANDMARKS } from '../../data/landmarks.js'

// „Каде одиш?“ + копче за моја локација + белешка по што е подредено
export default function OriginPicker({ origin, setOrigin, onLocate }) {
  const selectedLandmark = origin && !origin.mine ? origin.id || '' : ''

  return (
    <>
      <div className="search">
        <select value={selectedLandmark} onChange={(e) => setOrigin(LANDMARKS.find((l) => l.id === e.target.value) || null)}>
          <option value="">Каде одиш?</option>
          {LANDMARKS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <button className="icon-btn" onClick={onLocate} title="Моја локација">📍</button>
      </div>
      {origin && (
        <p className="origin-note">
          Подредено по растојание од <b>{origin.name}</b>{origin.fallback && ' (не можам да те лоцирам)'}
          {' · '}<button className="link" onClick={() => setOrigin(null)}>исчисти</button>
        </p>
      )}
    </>
  )
}
