/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      port: 5174
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }]
    },
    plugins: [react({ jsxImportSource: '@emotion/react' }), svgr()]
  }
})
