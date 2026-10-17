export default function ListSummary({ count, allCount, free }) {
  return (
    <div className="summary">
      <div><strong>{count}<small>/{allCount}</small></strong><span>паркинзи</span></div>
      <div><strong>{free}</strong><span>слободни места</span></div>
    </div>
  )
}
