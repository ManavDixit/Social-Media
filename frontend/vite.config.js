import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["manavsocial.loca.lt"],
    host: true, // ensures it binds to 0.0.0.0
  },
})
