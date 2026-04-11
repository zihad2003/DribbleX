import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
  },
  tsr: {
    // Optional router config if needed
  },
  react: {
    // Optional react config
  },
  routers: {
    client: {
      tsr: {
        // ...
      }
    }
  },
  // Setting prerender at the root level of config for Tanstack Start? 
  // Let me just test if it's accepted. Wait, let me replace the entire defineConfig.
})
