/*
  Асистент за паркинг — разбира прашања како:
    „Каде да паркирам близу Кале за 2 часа?“
    „евтин паркинг до плоштад“, „гаража со полнач“, „kade blisku do mene“
  Главниот асистент е Gemini (види gemini.js + backend/assistant.py).
  Ова овде е резервен асистент со правила (клучни зборови) — се користи само кога
  backend-от не е вклучен (демо режим), за апликацијата да работи и без интернет.
*/
import { parseQuestion } from './parseQuestion.js'
import { answerWhen } from './answerWhen.js'
import { answerBest } from './answerBest.js'

const HELP = 'Прашај ме на пример: „Каде да паркирам близу Кале за 2 часа?“, „евтин паркинг до плоштад“, „гаража со полнач“ или „кога е најмалку гужва кај Клинички?“'

export function answer(raw, { parkings, stats, origin, now = new Date() }) {
  const q = parseQuestion(raw)
  if (q.help) return { text: HELP, picks: [] }
  const from = q.landmark || origin
  return q.when
    ? answerWhen({ from, parkings, stats, now })
    : answerBest({ q, from, parkings, stats, now })
}
