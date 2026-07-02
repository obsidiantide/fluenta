import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Fix for any Node.js-style libraries that reference 'global'
    global: 'globalThis',
  },
})
