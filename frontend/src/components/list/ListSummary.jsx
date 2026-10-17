export default function ListSummary({ count, free }) {
  return (
    <div className="summary">
      <div><strong>{count}</strong><span>паркинзи</span></div>
      <div><strong>{free}</strong><span>слободни места</span></div>
    </div>
  )
}
