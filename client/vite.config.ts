import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  publicDir: 'public',
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      'ui-shared': resolve(__dirname, '../shared/src'),
    },
  },
})
