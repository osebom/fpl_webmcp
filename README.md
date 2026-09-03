# FPL WebMCP Planner

A local, read-only Fantasy Premier League planning workspace. It never authenticates with, or writes to, an FPL account: every transfer, lineup, and captaincy choice is hypothetical.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, enter a public FPL entry ID, and select **Load team**. Use **Refresh** to bypass the entry cache.

## Architecture

- `src/lib/fpl.ts`: normalized FPL API client and in-flight-deduplicated TTL cache.
- `src/lib/rules.ts`: deterministic squad and lineup validation.
- `src/components/planner.tsx`: planning state, scenario view, locks, and WebMCP adapter.
- `src/app/api/fpl/*`: small server-side read-only API routes.

`WebMcpBridge` registers coarse tools when the hosting browser exposes `navigator.modelContext.registerTool`. Its tool handlers operate on the same client planning state that the user sees. The adapter is intentionally contained because WebMCP browser APIs are still evolving.

## Cache configuration

Global bootstrap data and fixtures default to six hours; each entry defaults to 30 minutes. Set the variables in `.env.example` to change those defaults. Development logs include `CACHE HIT`, `CACHE MISS`, and `CACHE REFRESH`.

## Checks

```bash
npm test
npm run build
```
