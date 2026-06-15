/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Relative base so the bundle also works when opened from a sub-path or disk.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // Precache everything so the app is fully usable offline after first load.
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,woff,svg,png,ico,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // Never reach the network; this is an offline-first, no-backend app.
        runtimeCaching: [],
      },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'نقش — قبل العقد',
        short_name: 'نقش',
        description: 'أداة خاصة لقياس التوافق قبل عقد الزواج — تعمل دون اتصال.',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#0f3d3e',
        background_color: '#f7f4ef',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  build: {
    target: 'es2021',
    sourcemap: false,
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
  },
});
