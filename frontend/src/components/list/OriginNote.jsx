// Белешка по што е подредена листата (откако ќе те лоцираме)
export default function OriginNote({ origin, onClear }) {
  if (!origin) return null

  return (
    <p className="origin-note">
      Подредено по растојание од <b>{origin.name}</b>{origin.fallback && ' (не можам да те лоцирам)'}
      {' · '}<button className="link" onClick={onClear}>исчисти</button>
    </p>
  )
}
