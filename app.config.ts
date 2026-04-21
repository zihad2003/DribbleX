import { defineApp } from 'vinxi/config'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineApp({
  plugins: [
    tanstackStart({
      target: 'cloudflare-pages',
    }),
  ],
})
