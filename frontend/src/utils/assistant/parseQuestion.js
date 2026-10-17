import { LANDMARKS } from '../../data/landmarks.js'

// Клучни зборови (кирилица и латиница) по кои асистентот го разбира прашањето
const WORDS = {
  nearMe: ['близу мене', 'до мене', 'blisku do mene', 'blizu mene', 'near me', 'около мене', 'моја локација'],
  cheap: ['евтин', 'evtin', 'cheap', 'најевтин', 'najevtin'],
  garage: ['гаража', 'garaza', 'garaža', 'garage', 'покриен', 'pokrien'],
  ev: ['електр', 'elektr', 'полнач', 'полнење', 'polnac', 'polnenje', ' ev', 'tesla'],
  accessible: ['попреченост', 'инвалид', 'invalid', 'poprecenost', '♿'],
  when: ['кога', 'koga', 'when', 'најдобро време', 'najdobro vreme', 'гужва', 'guzva'],
  help: ['помош', 'pomos', 'help', 'што знаеш', 'sto znaes'],
}
const HOURS_RE = /(\d+)\s*(ч|час|саат|h|sat|hour)/
const MAX_HOURS = 12

const has = (text, words) => words.some((w) => text.includes(w))

export function parseQuestion(raw) {
  const text = raw.toLowerCase()
  const hoursMatch = text.match(HOURS_RE)
  return {
    landmark: LANDMARKS.find((l) => has(text, l.aliases)) || null,
    nearMe: has(text, WORDS.nearMe),
    hours: hoursMatch ? Math.min(MAX_HOURS, Math.max(1, Number(hoursMatch[1]))) : null,
    cheap: has(text, WORDS.cheap),
    garage: has(text, WORDS.garage),
    ev: has(text, WORDS.ev),
    accessible: has(text, WORDS.accessible),
    when: has(text, WORDS.when),
    help: has(text, WORDS.help) || text.trim().length < 3,
  }
}
