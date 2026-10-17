import './reserve.css'

// Име и регистарска таблица, една до друга
export default function DriverFields({ name, setName, plate, setPlate }) {
  return (
    <div className="reserve__row">
      <label>Име<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Теодора" /></label>
      <label>Регистарска<input className="upper" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="SK-1234-AB" /></label>
    </div>
  )
}
