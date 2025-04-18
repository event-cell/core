import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  build: {
    outDir: 'build',
    assetsDir: 'assets',
  },

  plugins: [reactRefresh()],
})
