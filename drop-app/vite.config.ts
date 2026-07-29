import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // im lokalen Netzwerk erreichbar (für Handy)
    port: 5173,
  },
})
