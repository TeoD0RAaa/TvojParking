// Нивоа на зафатеност (истиот редослед се користи и во легендата на мапата)
export const LEVELS = {
  many: { label: 'Има места', short: 'Има места', color: 'var(--green)' },
  few: { label: 'Малку места', short: 'Малку', color: 'var(--yellow)' },
  full: { label: 'Полн', short: 'Полн', color: 'var(--red)' },
}

// Статус на паркинг според процентот слободни места
export function availability(free, total) {
  const level = free <= 0 ? 'full' : free / total < 0.3 ? 'few' : 'many'
  return { level, ...LEVELS[level] }
}
