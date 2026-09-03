import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {port : 5174},
  // Built under /admin/ so the Express server can host the storefront at /
  // and this admin panel at /admin on a single deployed URL.
  base: '/admin/',
})
