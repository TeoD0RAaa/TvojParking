# TvojParking — Hakaton 2026

Апликација за паркинзи во Скопје: сива мапа на која се гледаат само паркинзите
(🟢 има места · 🟡 малку · 🔴 полн), детали за секое место, резервации, предвидување на гужва и AI.

## Стартување

### 1. Frontend (задолжително)
```
cd frontend
npm install
npm run dev
```
Отвори http://localhost:5173 — работи и без backend (горе пишува **● Демо**).

### 2. Backend (опционално, за заеднички резервации)
```
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
За асистентот (Gemini): направи фајл `backend/.env` (види `backend/.env.example`) со
```
GEMINI_API_KEY=твојот-клуч
```
`.env` е во `.gitignore` — **клучот никогаш не се качува на GitHub**. Секој од тимот си става свој клуч.
Освежи ја страната — горе ќе пише **● Сервер**. API документација: http://localhost:8000/docs

> Секогаш по `git pull` пуштете `npm install` ако некој додал нов пакет.

## Што има
| Дел | Каде во кодот |
|---|---|
| Сива мапа (Leaflet + OpenStreetMap/CARTO), пинови со број на слободни места | `components/ParkingMap.jsx` |
| 🧭 Најди ми паркинг (GPS), „Каде одиш?“, растојание и минути пешки | `components/ParkingList.jsx`, `lib/geo.js` |
| Филтри: гаражи / отворени, има место, до 40 ден, ♿, ⚡ | `App.jsx` (`filtered`) |
| Шема на местата (без блокови, по ред 01, 02, 03 …; ♿ први, ⚡ последни) | `components/details/SpotGrid.jsx`, `utils/spots.js` |
| Резервација, QR код, „Пристигнав“, истекува за 15 мин | `components/ReservationCard.jsx`, `lib/api.js`, `backend/main.py` |
| Одведи ме (Google Maps правец, без API клуч) | `lib/geo.js` → `directionsUrl` |
| Предвидување на гужва за следните 12 ч (статистичка проценка: просек по час + сегашна состојба, со ± грешка) | `utils/forecast.js`, `components/details/Forecast.jsx` |
| Симулација „во живо“ (коли влегуваат/излегуваат) | `App.jsx` (чекор 4) |
| 💬 Асистент со Gemini — ги гледа слободните места и прогнозата во живо | `backend/assistant.py`, `utils/assistant/gemini.js` |
| 📷 AI скенер: брои коли од слика (TensorFlow.js COCO-SSD) | `components/Scanner.jsx` |
| Темен режим, работи на телефон | `App.css` |

## Што е вистинско, а што симулирано
- **Вистински:** имињата и локациите на паркинзите, мапата, растојанијата, AI детекцијата на коли.
- **Симулирано:** капацитетот, зафатеноста (`occupancy` во `data/parkings.js`), дневните профили за предвидувањето.
  Во вистинска верзија би доаѓале од сензори, камери (AI скенерот) или од операторите на паркинзите.
- **Асистентот** е Gemini преку backend-от (`/api/assistant`). Ако backend-от не е вклучен, се користи резервен асистент со правила (офлајн).
