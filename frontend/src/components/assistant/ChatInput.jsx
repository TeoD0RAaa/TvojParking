import { useState } from 'react'

// Поле за прашање; се празни кога пораката е пратена
export default function ChatInput({ onSend }) {
  const [input, setInput] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (onSend(input)) setInput('')
  }
  return (
    <form className="chat__input" onSubmit={submit}>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Каде одиш?" />
      <button className="small primary">Прати</button>
    </form>
  )
}
