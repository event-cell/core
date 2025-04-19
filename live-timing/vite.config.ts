import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: false,
    rollupOptions: {
      input: {
        'live-timing': path.resolve(__dirname, 'src/index.html'),
        'personal-history': path.resolve(__dirname, 'src/personal-history.html'),
      },
      output: {
        // force assets to be emitted into each chunk's subfolder
        entryFileNames: asset => `[name]/assets/[name].js`,
        chunkFileNames: asset => `[name]/assets/[name]-[hash].js`,
        assetFileNames: asset => `[name]/assets/[name]-[hash][extname]`
      }
    },
  }
}) 