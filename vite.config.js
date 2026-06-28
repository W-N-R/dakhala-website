import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Dakhala Admissions',
        short_name: 'Dakhala',
        description: 'University Aggregate Calculator and Merit Tracker',
        theme_color: '#00D4FF',
        background_color: '#F0FFFE',
        display: 'standalone',
        icons: [] // Optionally add icons later
      }
    })
  ],
})
