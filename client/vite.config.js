import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Requests to /api and /auth are forwarded to the Express server during development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
    },
  },
})
