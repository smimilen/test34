import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️  ВАЖНО: замените 'wstyling-site' на точное название вашего репозитория на GitHub
// Например: github.com/username/my-car-site → напишите 'my-car-site'
const REPO_NAME = 'wstyling-site'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
