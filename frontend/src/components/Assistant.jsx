import { useEffect, useRef, useState } from 'react'
import { answer } from '../lib/assistant.js'
import { PARKINGS_BY_ID } from '../data/parkings.js'

const SUGGESTIONS = ['Каде да паркирам близу Кале за 2 часа?', 'Евтин паркинг до плоштад', 'Гаража со полнач', 'Кога е најмалку гужва кај Клинички?']

export default function Assistant({ parkings, stats, origin, onOpen }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Здраво! 👋 Кажи ми каде одиш, па ќе ти најдам паркинг.', picks: [] },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const ask = (text) => {
    if (!text.trim()) return
    const reply = answer(text, { parkings, stats, origin })
    setMessages((m) => [...m, { from: 'me', text }, { from: 'bot', ...reply }])
    setInput('')
  }

  return (
    <div className="panel-body chat">
      <h2 className="dname">Асистент</h2>
      <div className="chat__log">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg--${m.from}`}>
            <p>{m.text}</p>
            {m.picks?.length > 0 && (
              <div className="msg__picks">
                {m.picks.map((id) => (
                  <button key={id} className="pick" onClick={() => onOpen(id, m.hours)}>
                    <b>{PARKINGS_BY_ID[id].name}</b>
                    <span>{Math.max(0, stats[id].free)} слободни · {PARKINGS_BY_ID[id].pricePerHour} ден/ч →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chips">
        {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}
      </div>
      <form className="chat__input" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Каде одиш?" />
        <button className="small primary">Прати</button>
      </form>
    </div>
  )
}
