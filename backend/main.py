"""
TvojParking backend — FastAPI + SQLite.

Ги чува резервациите во фајл tvojparking.db, за сите корисници да гледаат исти резервации.
Правила:
  - едно место не може да има две активни резервации (одговор 409)
  - ако не пристигнеш (check-in) за graceMin минути, резервацијата истекува
    (graceMin = време на возење до паркингот според Google + 5 мин; стандардно 15)
  - по истекот на часовите, резервацијата истекува

Асистентот (/api/assistant) користи Gemini. API клучот се чува во backend/.env (НЕ се качува на GitHub):
    GEMINI_API_KEY=твојот-клуч

Стартување:  uvicorn main:app --reload      Документација: http://localhost:8000/docs
"""
import sqlite3
import time
import uuid
from pathlib import Path

from assistant import ChatRequest, ask_gemini

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB_PATH = Path(__file__).with_name("tvojparking.db")
DEFAULT_GRACE_MIN = 15  # ако frontend-от не прати време за пристигнување

app = FastAPI(title="TvojParking API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def now_ms() -> int:
    return int(time.time() * 1000)


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


with db() as conn:
    conn.execute(
        """CREATE TABLE IF NOT EXISTS reservations (
            id TEXT PRIMARY KEY,
            parking_id TEXT NOT NULL,
            spot_id TEXT NOT NULL,
            plate TEXT NOT NULL,
            user TEXT NOT NULL,
            hours INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            until INTEGER NOT NULL,
            checked_in INTEGER NOT NULL DEFAULT 0,
            grace_min INTEGER NOT NULL DEFAULT 15
        )"""
    )
    # постари бази немаат grace_min -> додај ја колоната
    cols = {r["name"] for r in conn.execute("PRAGMA table_info(reservations)")}
    if "grace_min" not in cols:
        conn.execute("ALTER TABLE reservations ADD COLUMN grace_min INTEGER NOT NULL DEFAULT 15")


def purge_expired(conn: sqlite3.Connection) -> None:
    """Ги брише истечените резервации."""
    t = now_ms()
    conn.execute(
        "DELETE FROM reservations WHERE until <= ? OR (checked_in = 0 AND created_at + grace_min * 60000 <= ?)",
        (t, t),
    )


def to_json(r: sqlite3.Row) -> dict:
    return {
        "id": r["id"],
        "parkingId": r["parking_id"],
        "spotId": r["spot_id"],
        "plate": r["plate"],
        "user": r["user"],
        "hours": r["hours"],
        "createdAt": r["created_at"],
        "until": r["until"],
        "checkedIn": bool(r["checked_in"]),
        "graceMin": r["grace_min"],
    }


class NewReservation(BaseModel):
    parkingId: str
    spotId: str
    plate: str = Field(min_length=4, max_length=15)
    user: str = Field(min_length=2, max_length=40)
    hours: int = Field(ge=1, le=12)
    graceMin: int = Field(default=DEFAULT_GRACE_MIN, ge=5, le=120)  # возење до паркингот + 5 мин


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/reservations")
def list_reservations():
    with db() as conn:
        purge_expired(conn)
        rows = conn.execute("SELECT * FROM reservations ORDER BY created_at").fetchall()
    return [to_json(r) for r in rows]


@app.post("/api/reservations", status_code=201)
def create_reservation(body: NewReservation):
    with db() as conn:
        purge_expired(conn)
        taken = conn.execute(
            "SELECT 1 FROM reservations WHERE parking_id = ? AND spot_id = ?",
            (body.parkingId, body.spotId),
        ).fetchone()
        if taken:
            raise HTTPException(409, "Ова место штотуку го резервирал некој друг. Избери друго.")
        t = now_ms()
        rid = str(uuid.uuid4())
        conn.execute(
            "INSERT INTO reservations (id, parking_id, spot_id, plate, user, hours, created_at, until, checked_in, grace_min)"
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)",
            (rid, body.parkingId, body.spotId, body.plate.upper(), body.user, body.hours, t,
             t + body.hours * 3_600_000, body.graceMin),
        )
        row = conn.execute("SELECT * FROM reservations WHERE id = ?", (rid,)).fetchone()
    return to_json(row)


@app.post("/api/reservations/{rid}/checkin")
def check_in(rid: str):
    with db() as conn:
        purge_expired(conn)
        cur = conn.execute("UPDATE reservations SET checked_in = 1 WHERE id = ?", (rid,))
        if cur.rowcount == 0:
            raise HTTPException(404, "Резервацијата не постои или истекла.")
        row = conn.execute("SELECT * FROM reservations WHERE id = ?", (rid,)).fetchone()
    return to_json(row)


@app.delete("/api/reservations/{rid}", status_code=204)
def cancel(rid: str):
    with db() as conn:
        conn.execute("DELETE FROM reservations WHERE id = ?", (rid,))
    return Response(status_code=204)


@app.post("/api/assistant")
def assistant(body: ChatRequest):
    """Асистент со Gemini: добива прашање + сегашна состојба на паркинзите, враќа одговор и предлози."""
    return ask_gemini(body)
