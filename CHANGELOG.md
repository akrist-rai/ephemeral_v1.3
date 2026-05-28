# Changelog

All notable changes to EPHEMERAL are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.3.0] — 2026-05-28

### Added
- Vercel serverless deployment via `api/index.ts` single entrypoint
- GitHub Actions CI pipeline (build + type-check on push/PR)
- `vercel.json` routing: static frontend ↔ serverless API
- `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`
- `.env.example` for onboarding

### Changed
- Backend refactored to export Koa app for serverless compatibility
- Vite proxy config aligned with `/api` rewrite rules in `vercel.json`

### Fixed
- CORS headers now correctly applied in production (Vercel origin)

---

## [1.2.0]

### Added
- Degrading points system: 100% → 70% → 40% per wrong attempt
- Real-time HUD: XP, rank, and solve count
- Drizzle ORM schema with `challenges`, `submissions`, `users` tables
- Neon Serverless Postgres integration

---

## [1.1.0]

### Added
- Koa-Helmet security headers
- `@koa/cors` with allowlist configuration
- `koa-compress` response compression

---

## [1.0.0]

### Added
- Initial EPHEMERAL CTF Engine
- React 19 + Vite frontend with CRT/phosphor aesthetic
- Koa.js backend with flag validation endpoint
- Bun as runtime and script runner
