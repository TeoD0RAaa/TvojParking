import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // барањата до /api одат на FastAPI (ако е вклучен); ако не е, апликацијата работи во демо режим
    proxy: { '/api': 'http://localhost:8000' },
  },
})
