const TITLES = {
  firebase: 'Резервациите се во Firebase — сите корисници ги гледаат истите, во живо',
  server: 'Поврзано со FastAPI backend',
  local: 'Backend-от не е вклучен — резервациите се само во овој прелистувач',
}
const LABELS = { firebase: '● Firebase', server: '● Сервер', local: '● Демо' }

export default function ModeBadge({ mode }) {
  return (
    <span className={`mode mode--${mode === 'local' ? 'local' : 'server'}`} title={TITLES[mode]}>
      {LABELS[mode] || LABELS.local}
    </span>
  )
}
