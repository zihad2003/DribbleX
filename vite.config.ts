import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: '.output/public',
  },
  environments: {
    client: {
      build: {
        outDir: '.output/public',
      },
    },
    ssr: {
      build: {
        outDir: '.output/public',
        rollupOptions: {
          output: {
            entryFileNames: '_worker.js',
          },
        },
      },
    },
  },
  server: {
    port: 3000,
    allowedHosts: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      prerender: {
        crawlLinks: true
      }
    }),
    viteReact(),
  ],
})
