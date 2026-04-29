import { readFileSync, writeFileSync } from 'fs'

// Read the built SSR server
let serverCode = readFileSync('.output/server/server.js', 'utf8')

// The SSR bundle ends with:
//   export { createServerEntry, server as default };
// We need to rename 'server as default' -> 'server' so we can re-export our own default.
serverCode = serverCode.replace(
  /export\s*\{([^}]*)\bserver\s+as\s+default\b([^}]*)\}/,
  (match, before, after) => {
    // Remove 'server as default' from the named exports block
    const cleaned = (before + after).replace(/,\s*,/g, ',').replace(/^,|,$/g, '').trim()
    return cleaned ? `export { ${cleaned} }` : ''
  }
)

// Now append our Cloudflare Pages wrapper that:
// 1. Serves static assets via env.ASSETS for /assets/* requests
// 2. Falls through to the SSR handler for everything else
const wrapper = `
// Cloudflare Pages Worker - wraps TanStack Start SSR with static asset passthrough
${serverCode}

// server is already declared by the SSR bundle above; use it as the SSR fetch handler
const workerHandler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // Delegate static assets (hashed files, favicon, images) to Cloudflare Pages ASSETS binding
    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname === '/favicon.ico' ||
      url.pathname === '/logo.png'
    ) {
      return env.ASSETS.fetch(request)
    }

    // Everything else goes to the SSR handler
    return server.fetch(request, env, ctx)
  }
}

export default workerHandler
`.trim()

writeFileSync('.output/public/_worker.js', wrapper, 'utf8')
console.log('✓ _worker.js written with ASSETS passthrough')

