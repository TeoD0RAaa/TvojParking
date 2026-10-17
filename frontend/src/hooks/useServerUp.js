import { useEffect, useState } from 'react'
import { isServerUp } from '../utils/api/index.js'

// Дали FastAPI backend-от е вклучен (за асистентот преку /api/assistant), независно од тоа каде се резервациите
export function useServerUp() {
  const [up, setUp] = useState(false)
  useEffect(() => { isServerUp().then(setUp) }, [])
  return up
}
