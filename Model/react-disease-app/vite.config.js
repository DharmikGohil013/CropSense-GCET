import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: true,
    host: true,
    port: 5173,
    open: true
  },
  preview: {
    https: true,
    host: true,
    port: 4173,
    open: true
  }
})
