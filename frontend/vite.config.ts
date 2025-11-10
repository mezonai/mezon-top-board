import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000
  },
  define: {
    'process.env': process.env // Inject process.env
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
    }
  }
})
