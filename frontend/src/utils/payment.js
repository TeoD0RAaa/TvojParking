/*
  ДЕМО плаќање — нема вистинска наплата.
  Од картичката чуваме САМО вид (Visa/Mastercard), последни 4 цифри и рок.
  Целиот број и CVC никогаш не се зачувуваат.
*/
export const TEST_CARD = { number: '4242 4242 4242 4242', exp: '12/29', cvc: '123', holder: 'DEMO KORISNIK' }
const PROCESSING_MS = 1200

export const digitsOnly = (s) => s.replace(/\D/g, '')

// 1234567812345678 -> "1234 5678 1234 5678"
export const formatCardNumber = (s) => digitsOnly(s).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

// 1229 -> "12/29"
export function formatExp(s) {
  const d = digitsOnly(s).slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

// Луновиот алгоритам: проверка дали бројот на картичката е валиден
export function luhnValid(number) {
  const d = digitsOnly(number)
  if (d.length < 13 || d.length > 19) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let x = Number(d[d.length - 1 - i])
    if (i % 2 === 1) { x *= 2; if (x > 9) x -= 9 }
    sum += x
  }
  return sum % 10 === 0
}

export function expValid(exp, now = new Date()) {
  const m = exp.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const month = Number(m[1]); const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

export function cardBrand(number) {
  const d = digitsOnly(number)
  if (d.startsWith('4')) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard'
  if (/^3[47]/.test(d)) return 'Amex'
  return 'Картичка'
}

// Проверка на целата форма -> { ok, errors: { number?, exp?, cvc?, holder? } }
export function validateCard({ number, exp, cvc, holder }) {
  const errors = {}
  if (!luhnValid(number)) errors.number = 'Невалиден број на картичка'
  if (!expValid(exp)) errors.exp = 'Невалиден или истечен рок'
  if (!/^\d{3,4}$/.test(cvc)) errors.cvc = '3 цифри'
  if (holder.trim().length < 3) errors.holder = 'Внеси име'
  return { ok: Object.keys(errors).length === 0, errors }
}

// Што се зачувува (без целиот број и без CVC)
export const safeCard = ({ number, exp, holder }) => ({
  brand: cardBrand(number), last4: digitsOnly(number).slice(-4), exp, holder: holder.trim().toUpperCase(),
})

// „Наплата“: само чека малку како вистински процесор и враќа потврда
export const chargeCard = (card, amount) =>
  new Promise((resolve) => setTimeout(() => resolve({ id: crypto.randomUUID(), amount, card: `${card.brand} •••• ${card.last4}` }), PROCESSING_MS))
