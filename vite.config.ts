import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  environments: {
    // Client (browser) assets → same folder as worker so Pages serves both
    client: {
      build: {
        outDir: '.output/public',
      },
    },
    // SSR environment → runs in Cloudflare Workerd, output as _worker.js
    ssr: {
      build: {
        outDir: '.output/public',
        rollupOptions: {
          output: {
            entryFileNames: '_worker.js',
            format: 'esm',
          },
        },
      },
    },
  },

  server: {
    port: 3000,
  },

  plugins: [
    // Inline Cloudflare config — no root wrangler.toml needed.
    // Provides D1 + compat flags for local `vite dev` via Workerd.
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      config: () => ({
        compatibility_date: '2024-09-23',
        compatibility_flags: ['nodejs_compat'],
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'dribblex_db',
            // Replace with your real D1 database ID for local dev,
            // or run: npx wrangler d1 create dribblex_db
            database_id: '00000000-0000-0000-0000-000000000000',
          },
        ],
      }),
    }),

    tailwindcss(),

    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),

    // TanStack Start — manages routing, SSR, and server functions.
    // Must come AFTER cloudflare() so the Workerd environment is ready.
    tanstackStart(),
  ],
})
