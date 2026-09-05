import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backendUrl = process.env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:8000'

// Dev-only: proxy backend routes so the browser sees a single origin.
// Required for Sanctum cookie + CSRF auth (axios must read XSRF-TOKEN from document.cookie).
// In production, set VITE_API_URL instead — no proxy needed.
const proxyConfig = {
  target: backendUrl,
  changeOrigin: true,
  secure: false,
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '^/(api|sanctum|login|register|logout)': proxyConfig,
    },
  },
})
