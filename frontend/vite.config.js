import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // секогаш на 5173: Google Maps клучот е дозволен само за localhost:5173.
    // Ако портата е зафатена (старо `npm run dev`), Vite јавува грешка наместо тивко да оди на 5174/5175.
    port: 5173,
    strictPort: true,
    // барањата до /api одат на FastAPI (ако е вклучен); ако не е, апликацијата работи во демо режим
    proxy: { '/api': 'http://localhost:8000' },
  },
})
