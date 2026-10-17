"""
Асистент за паркинг со Gemini API.

Frontend-от праќа: прашањето, претходните пораки и СЕГАШНАТА состојба на паркинзите
(слободни места, цена, растојание, наша статистичка проценка за следните часови).
Gemini одговара во JSON: { text, picks: [id-а на паркинзи], hours }.

Клучот е во backend/.env  ->  GEMINI_API_KEY=...
(опционално GEMINI_MODEL=... ако сакате друг модел)
"""
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

from fastapi import HTTPException
from pydantic import BaseModel, Field

ENV_PATH = Path(__file__).with_name(".env")
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
# Ако првиот модел не постои / не е достапен за клучот, пробува со следниот
DEFAULT_MODELS = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.6-flash", "gemini-3.5-flash-lite"]


def load_env() -> None:
    """Чита KEY=VALUE линии од backend/.env (без дополнителни пакети)."""
    if not ENV_PATH.exists():
        return
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


load_env()


class ChatTurn(BaseModel):
    role: str  # "user" | "model"
    text: str = Field(max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    history: list[ChatTurn] = []
    context: dict  # состојбата на паркинзите што ја праќа frontend-от


SYSTEM_PROMPT = """Ти си асистентот на апликацијата TvojParking за паркинзи во Скопје.
Зборуваш на македонски (ако корисникот пишува на латиница или англиски, одговори на истиот јазик),
кратко и пријателски: 1–3 реченици.

Во секое барање добиваш JSON „context“ со СЕГАШНАТА состојба:
- parkings: секој паркинг со id, име, тип, адреса, цена (ден/час), слободни/вкупно места,
  слободни ♿ и ⚡ места, растојание од корисникот (km, ако е познато) и
  forecast = наша статистичка проценка на слободни места за следните часови.
- landmarks: познати места во Скопје со координати.
- origin: каде е корисникот (ако е познато), now: сегашно време.

Правила:
- Користи САМО податоците од context. Не измислувај паркинзи, цени или бројки.
- Ако корисникот спомене место (на пр. Кале, плоштад), избери паркинзи близу тоа место според координатите.
- Ако паркинг има 0 слободни места, не го препорачувај за паркирање сега (освен ако прашува „кога“).
- За „кога е најмалку гужва“ користи го forecast.
- Ако корисникот каже колку часа, пресметај ја цената (часови × цена).
- picks: до 3 id-а на паркинзи што ги препорачуваш (најдобриот прв), или празна листа.
- hours: колку часа сака да паркира, ако го кажал; инаку null.
"""

RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "text": {"type": "STRING"},
        "picks": {"type": "ARRAY", "items": {"type": "STRING"}},
        "hours": {"type": "INTEGER", "nullable": True},
    },
    "required": ["text", "picks"],
}


def _call(model: str, key: str, payload: dict) -> dict:
    req = urllib.request.Request(
        API_URL.format(model=model),
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": key},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def ask_gemini(body: ChatRequest) -> dict:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise HTTPException(503, "Асистентот нема API клуч. Додај GEMINI_API_KEY во backend/.env")

    contents = [{"role": t.role if t.role in ("user", "model") else "user", "parts": [{"text": t.text}]}
                for t in body.history[-10:]]
    contents.append({
        "role": "user",
        "parts": [{"text": f"context:\n{json.dumps(body.context, ensure_ascii=False)}\n\nПрашање: {body.message}"}],
    })
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "temperature": 0.4,
            "responseMimeType": "application/json",
            "responseSchema": RESPONSE_SCHEMA,
        },
    }

    env_model = os.environ.get("GEMINI_MODEL")
    models = [env_model] if env_model else DEFAULT_MODELS
    last_error = "непозната грешка"
    for model in models:
        try:
            data = _call(model, key, payload)
            break
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:300]
            last_error = f"{e.code}: {detail}"
            if e.code in (400, 404):  # моделот не постои / не е поддржан -> пробај следен
                continue
            if e.code in (401, 403):
                raise HTTPException(502, "Gemini го одби API клучот (провери GEMINI_API_KEY).")
            if e.code == 429:
                raise HTTPException(429, "Премногу прашања кон Gemini — пробај пак за малку.")
            raise HTTPException(502, f"Грешка од Gemini ({last_error})")
        except urllib.error.URLError as e:
            raise HTTPException(502, f"Нема врска со Gemini: {e.reason}")
    else:
        raise HTTPException(502, f"Ниту еден Gemini модел не одговори ({last_error})")

    try:
        raw = data["candidates"][0]["content"]["parts"][0]["text"]
        out = json.loads(raw)
    except (KeyError, IndexError, json.JSONDecodeError):
        raise HTTPException(502, "Gemini врати неочекуван одговор.")

    valid_ids = {p.get("id") for p in body.context.get("parkings", [])}
    picks = [p for p in out.get("picks", []) if p in valid_ids][:3]
    hours = out.get("hours")
    hours = hours if isinstance(hours, int) and 1 <= hours <= 12 else None
    return {"text": str(out.get("text", "")).strip(), "picks": picks, "hours": hours, "model": model}
