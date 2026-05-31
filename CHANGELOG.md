# Changelog

All notable changes to EPHEMERAL are documented here.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.3.2] — 2026-05-31

### Added
- **Multi-domain AuthGate** — lander page now shows the full platform identity (8 domain pills, domain showcase cards, 6 capability cards) instead of CTF-only marketing copy
- **Intel Briefing resources tab** — resources rendered as typed cards (VIDEO/PAPER/ARTICLE) with a mission primer and a prominent "Enter CTF Arena" CTA
- **Clean CTF detail view** — challenge workspace rebuilt as a two-column layout; flag submission is now the third visible element, not the fifth; removed the inline chapter/stage system and code sandbox from the primary view
- `ProgressService.solveWithXp()` — marks a challenge solved and increments user XP atomically inside a single DB transaction
- `addXpSchema` Zod validator; `POST /api/progress/:userId/add-xp` now validates the body (`xp` must be a positive integer ≤ 10 000)
- `getEpisodeImageSafe()` exported from `imageMapping.ts` — guaranteed non-empty path with fallback
- Arc 9 (Initiation / Programming Basics) episode image mappings (`S1E1_A9`–`S1E8_A9` → `86–93.jpeg`)
- `public/one_piece/` is now a clean sequential range: **1–101.jpeg** — all named/timestamp files renamed

### Changed
- `ContentController.getAvatars` serves from `public/avatar/` (was incorrectly reading `public/one_piece/`); uses top-level `node:fs` import instead of inline `require()`
- `UserController.getProgress` now fetches the user row and progress rows in parallel (`Promise.all`) and derives `challengesSolved` locally — eliminates a third sequential DB query
- `UserController.submitFlag` delegates the correct-answer write path to `ProgressService.solveWithXp()` (transactional); removed the manual two-step upsert + addXp
- `useApi.ts` — rewritten for correctness: network errors and non-JSON bodies now throw with descriptive messages; the `{ success, data }` envelope is reliably unwrapped; removed the `.catch(() => null)` silent-swallow pattern
- `App.tsx` — added missing `Challenge` type import; removed stale `RankedSiege` import; `awardCalibrationXp` now includes `Content-Type: application/json` header; `getChallengePath` uses a safe fallback instead of hardcoded `/episode/1/S1E1_A1`; `arcEpisodes[selectedArc?.id ?? 0]` replaced with null-safe `selectedArc ? arcEpisodes[selectedArc.id] ?? [] : []`
- `README.md` — resolved merge conflict; updated to reflect multi-domain platform identity, full project structure, image asset layout, and adding-content workflow
- `CLAUDE.md` — added Content Workflow and Image Assets sections

### Fixed
- `RankedSiege` component removed from home screen assembly (was rendering hardcoded fake data)
- `Content-Type` header missing from calibration XP API call (caused Koa body-parser to reject the request)
- `Challenge` type not imported in `App.tsx` (caused a runtime `ReferenceError` in strict environments)
- `getAvatars` endpoint pointed at the wrong directory and used synchronous `require()` inside an async handler

---

## [1.3.1] — 2026-05-29

### Added
- High-fidelity split-grid CTF operator workstation (two-column detail layout)
- Database purge utility integrated into `bun run db:seed`
- SearchOverlay uses dynamic challenge path resolution via `getChallengePath`
- Episode-based challenge scoping (`GET /api/episodes/:arcId/:episodeId/challenges`)

### Changed
- Challenge data migrated from arc-based to episode-based `episodeId` scoping
- Arc image collection refreshed; imageMapping updated for all 8 arcs

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
