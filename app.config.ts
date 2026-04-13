import { defineConfig } from '@tanstack/react-start'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
  },
  vite: {
    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
    ssr: {
      // Ensure these are bundled into the worker, not treated as external
      noExternal: ['vinxi', '@tanstack/react-start'],
    },
  },
})