import { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage.jsx'
import ChatInput from './ChatInput.jsx'
import { answer } from '../../utils/assistant/index.js'
import { askGemini, hasDirectKey } from '../../utils/assistant/gemini.js'
import { useServerUp } from '../../hooks/useServerUp.js'
import './assistant.css'

const SUGGESTIONS = ['Каде да паркирам близу Кале за 2 часа?', 'Евтин паркинг до плоштад', 'Гаража со полнач', 'Кога е најмалку гужва кај Клинички?']
const GREETING = { from: 'bot', text: 'Здраво! 👋 Кажи ми каде одиш, па ќе ти најдам паркинг.', picks: [] }

// Gemini: директно со клучот од .env.local, или преку backend-от. Без клуч и без backend -> резервен асистент со правила.
export default function Assistant({ parkings, stats, origin, mode, onOpen }) {
  const [messages, setMessages] = useState([GREETING])
  const [thinking, setThinking] = useState(false)
  const serverUp = useServerUp() // резервациите можат да се во Firebase, а асистентот сепак да оди преку backend-от
  const gemini = hasDirectKey || mode === 'server' || serverUp
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  const offline = (text, note) => ({ from: 'bot', ...answer(text, { parkings, stats, origin }), note })

  const ask = (text) => {
    if (!text.trim() || thinking) return false
    const history = messages.slice(1) // без поздравот
    setMessages((m) => [...m, { from: 'me', text }])

    if (!gemini) {
      setMessages((m) => [...m, offline(text, 'Офлајн одговор — додај VITE_GEMINI_API_KEY во frontend/.env.local.')])
      return true
    }
    setThinking(true)
    askGemini(text, history, { parkings, stats, origin })
      .then((reply) => setMessages((m) => [...m, { from: 'bot', ...reply }]))
      .catch((err) => setMessages((m) => [...m, offline(text, `Gemini не одговори (${err.message}) — офлајн одговор.`)]))
      .finally(() => setThinking(false))
    return true
  }

  return (
    <div className="panel-body chat">
      <h2 className="dname">Асистент</h2>
      <p className="dmeta">{gemini ? '✨ Gemini · ги гледа слободните места во живо' : 'Офлајн режим (нема Gemini клуч)'}</p>
      <div className="chat__log">
        {messages.map((m, i) => <ChatMessage key={i} message={m} stats={stats} onOpen={onOpen} />)}
        {thinking && <div className="msg msg--bot msg--typing"><span /><span /><span /></div>}
        <div ref={endRef} />
      </div>
      <div className="chips">
        {SUGGESTIONS.map((s) => <button key={s} className="chip" disabled={thinking} onClick={() => ask(s)}>{s}</button>)}
      </div>
      <ChatInput onSend={ask} disabled={thinking} />
    </div>
  )
}
