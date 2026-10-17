/*
  Асистент за паркинг — разбира прашања како:
    „Каде да паркирам близу Кале за 2 часа?“
    „евтин паркинг до плоштад“, „гаража со полнач“, „kade blisku do mene“
  Ова е асистент со правила (бара клучни зборови) — работи без интернет и без API клуч.
  Подоцна може да се замени со вистински LLM (на пр. Claude API) преку backend-от.
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
