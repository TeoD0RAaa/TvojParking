import { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage.jsx'
import ChatInput from './ChatInput.jsx'
import { answer } from '../../utils/assistant/index.js'
import './assistant.css'

const SUGGESTIONS = ['Каде да паркирам близу Кале за 2 часа?', 'Евтин паркинг до плоштад', 'Гаража со полнач', 'Кога е најмалку гужва кај Клинички?']
const GREETING = { from: 'bot', text: 'Здраво! 👋 Кажи ми каде одиш, па ќе ти најдам паркинг.', picks: [] }

export default function Assistant({ parkings, stats, origin, onOpen }) {
  const [messages, setMessages] = useState([GREETING])
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const ask = (text) => {
    if (!text.trim()) return false
    const reply = answer(text, { parkings, stats, origin })
    setMessages((m) => [...m, { from: 'me', text }, { from: 'bot', ...reply }])
    return true
  }

  return (
    <div className="panel-body chat">
      <h2 className="dname">Асистент</h2>
      <div className="chat__log">
        {messages.map((m, i) => <ChatMessage key={i} message={m} stats={stats} onOpen={onOpen} />)}
        <div ref={endRef} />
      </div>
      <div className="chips">
        {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}
      </div>
      <ChatInput onSend={ask} />
    </div>
  )
}
