import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    // Plugin React pour la compilation JSX
    react(),
    // Configuration du plugin PWA
    VitePWA({
      // Mise à jour automatique du Service Worker
      registerType: 'autoUpdate',
      // Activation du mode PWA en développement
      devOptions: {
        enabled: true
      },
      // Fichiers à inclure dans le manifest
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      // Configuration du manifest.json pour l'installation de la PWA
      manifest: {
        name: 'MangaMania',
        short_name: 'MangaMania',
        description: 'Votre collection de mangas personnelle',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        // Mode d'affichage standalone (comme une app native)
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait',
        // Définition des icônes pour différentes tailles
        icons: [
          {
            src: '/assets/naruto.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/naruto.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/naruto.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      // Configuration de Workbox pour la gestion du cache
      workbox: {
        // Dossier contenant les fichiers à mettre en cache
        globDirectory: 'dist',
        // Patterns des fichiers à mettre en cache automatiquement
        globPatterns: [
          '**/*.{js,css,html,ico,png,webp,svg,woff,woff2,jpg,jpeg}'
        ],
        // Configuration du cache dynamique
        runtimeCaching: [
          {
            // Cache pour l'API Jikan
            urlPattern: /^https:\/\/api\.jikan\.moe\/v4/,
            // Stratégie "Network First" : essaie d'abord le réseau, puis le cache
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jikan-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache pour toutes les images (locales et externes)
            urlPattern: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
            // Stratégie "StaleWhileRevalidate" : affiche le cache puis met à jour en arrière-plan
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  // Exclusion de lucide-react de l'optimisation des dépendances
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});