import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const REPO_NAME = 'test34'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO_NAME}/` : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
