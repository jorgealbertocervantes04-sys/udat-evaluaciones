import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Esto fuerza a que la app guarde sus archivos para uso sin internet
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Evaluación Operativa UDAT',
        short_name: 'Eval UDAT',
        description: 'Herramienta offline para evaluación de mentores de carga pesada',
        theme_color: '#1d4ed8', // Azul profesional
        background_color: '#ffffff',
        display: 'standalone', // Oculta la barra del navegador para que luzca como app nativa
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})