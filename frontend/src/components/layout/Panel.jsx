import Brand from './Brand.jsx'
import './layout.css'

// Левиот панел: лого горе, содржина (листа или детали) под него
export default function Panel({ children }) {
  return (
    <aside className="panel">
      <Brand />
      {children}
    </aside>
  )
}
