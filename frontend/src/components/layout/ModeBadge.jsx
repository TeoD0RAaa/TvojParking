const TITLES = {
  server: 'Поврзано со FastAPI backend',
  local: 'Backend-от не е вклучен — резервациите се само во овој прелистувач',
}

export default function ModeBadge({ mode }) {
  return (
    <span className={`mode mode--${mode}`} title={TITLES[mode]}>
      {mode === 'server' ? '● Сервер' : '● Демо'}
    </span>
  )
}
