import { useEffect, useState } from 'react'
import { detectMode } from '../utils/api/index.js'

// 'firebase' ако Firestore е достапен, 'server' ако FastAPI backend-от е вклучен, инаку 'local' (демо)
export function useApiMode() {
  const [mode, setMode] = useState('local')
  useEffect(() => { detectMode().then(setMode) }, [])
  return mode
}
