# DribbleX Turf
A premium football experience reservation platform.

## Tech Stack
- **Framework**: TanStack Start (React)
- **Database**: Cloudflare D1 (SQL)
- **Deployment**: Cloudflare Pages / Workers
- **Backend Logic**: TanStack Server Functions
- **Styling**: Tailwind CSS v4
- **ORM-less**: Direct D1 Prepared Statements
- **Frontend State**: TanStack Query
- **Routing**: TanStack Router

## Getting Started
1. Install dependencies: `npm install`
2. Create D1 database: `npx wrangler d1 create dribblex_db`
3. Update `wrangler.json` with your `database_id`.
4. Apply migrations: `npx wrangler d1 migrations apply dribblex_db --local`
5. Run dev server: `npm run dev`
