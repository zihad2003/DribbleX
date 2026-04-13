# Cloudflare Pages Deployment Guide

## Prerequisites

- Cloudflare account with Pages enabled
- A D1 database created for production:
  ```bash
  npx wrangler d1 create dribblex_db
  ```
- Migrations applied to the production database:
  ```bash
  npx wrangler d1 migrations apply dribblex_db --remote
  ```

---

## Cloudflare Pages Dashboard Settings

### 1. Build Configuration

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `.output/public` |

### 2. Environment Variables / Compatibility

In **Settings → Functions**:

| Setting | Value |
|---|---|
| Compatibility flag | `nodejs_compat` |
| Compatibility date | `2024-09-23` (or later) |

### 3. D1 Database Binding

In **Settings → Functions → D1 database bindings**:

| Variable name | D1 database |
|---|---|
| `DB` | `dribblex_db` (your production D1 database) |

> The binding name **must** be `DB` — this matches the `env.DB` reference in `src/server/bookings.ts`.

---

## Local Development

```bash
npm install
npm run dev
```

For local D1 access, apply migrations locally first:

```bash
npx wrangler d1 migrations apply dribblex_db --local
```

---

## Build & Preview

```bash
npm run build
npx wrangler pages dev .output/public
```

---

## Project Structure Notes

- **Build tool**: `vinxi` via `app.config.ts` (TanStack Start with `cloudflare-pages` preset)
- **Database**: Cloudflare D1 — accessed via the `DB` binding in server functions
- **Output**: `.output/public/` (static assets + `_worker.js` SSR entry)
- **Migrations**: Located in `migrations/` — apply with `wrangler d1 migrations apply`
