import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react'

export default defineConfig({
    build: {
        outDir: 'build'
    },

    plugins: [
        reactRefresh()

    ]
})