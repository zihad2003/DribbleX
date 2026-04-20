import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  plugins: [
    tanstackStart({
      target: 'cloudflare-pages',
    }),
    react(),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  environments: {
    client: {
      build: {
        outDir: '.output/public',
      },
    },
    ssr: {
      build: {
        outDir: '.output/server',
      },
    },
  },
})

