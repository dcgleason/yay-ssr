import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const { resolve } = require('path')
import viteSSR from 'vite-ssr/plugin.js'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()]
// })



module.exports = defineConfig({
  plugins: [
    react(),
    viteSSR(),
  ],
  server: {
    watch: {
      ignored: ['!**/node_modules/your-package-name/**']
    }
  }

})