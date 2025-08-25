import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  root: '.',
  publicDir: false, // Disable default public dir to avoid conflicts
  base: '/', // Use root path for dev server
  build: {
    outDir: '.',
    assetsDir: 'dist-assets',
    base: '/cotc/',
    rollupOptions: {
      input: 'index-vue.html',
      output: {
        entryFileNames: 'dist-assets/[name].[hash].js',
        chunkFileNames: 'dist-assets/[name].[hash].js',
        assetFileNames: 'dist-assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: '/index-vue.html', // Open Vue version by default
    // Allow WSL access
    allowedHosts: [
      'VJSamBD2024.local',
      '.local',
      'localhost',
      '127.0.0.1'
    ],
    // Serve static files from project root
    fs: {
      strict: false,
      allow: ['..']
    }
  }
})