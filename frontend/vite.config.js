
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Bundle visualizer helps analyze bundle size and optimize performance
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Visualizer plugin: generates bundle analysis after build
    visualizer({ open: true }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})