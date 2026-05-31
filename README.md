<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    ║
║    ░                                                  ░    ║
║    ░    ███████╗██████╗ ██╗  ██╗███████╗███╗   ███╗   ░    ║
║    ░    ██╔════╝██╔══██╗██║  ██║██╔════╝████╗ ████║   ░    ║
║    ░    █████╗  ██████╔╝███████║█████╗  ██╔████╔██║   ░    ║
║    ░    ██╔══╝  ██╔═══╝ ██╔══██║██╔══╝  ██║╚██╔╝██║   ░    ║
║    ░    ███████╗██║     ██║  ██║███████╗██║ ╚═╝ ██║   ░    ║
║    ░    ╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝   ░    ║
║    ░                                                  ░    ║
║    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    ║
║                                                              ║
║       M U L T I - D O M A I N · L E A R N I N G · C T F    ║
║                                                              ║
║         K·I·N·D·E·R·H·E·I·M  ·  5·1·1  ·  J·O·H·A·N       ║
║                   [ RUHENHEIM_NODE ]                         ║
╚══════════════════════════════════════════════════════════════╝
```

**A multi-domain intelligence academy.** Learn algorithms through story-driven episodes, crack real exploits in cybersecurity CTFs, visualize machine learning from scratch — all in a single CRT-terminal platform.

<br/>

[![CI](https://github.com/akrist-rai/ephemeral_v1.3/actions/workflows/ci.yml/badge.svg)](https://github.com/akrist-rai/ephemeral_v1.3/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://ephemeral-v1-3.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Koa](https://img.shields.io/badge/Koa.js-2-33333D?logo=node.js&logoColor=white)](https://koajs.com)
[![Bun](https://img.shields.io/badge/runtime-Bun-fbf0df?logo=bun&logoColor=black)](https://bun.sh)
[![Neon](https://img.shields.io/badge/database-Neon%20Postgres-00E599?logo=postgresql&logoColor=black)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

<br/>

[**Live Demo →**](https://ephemeral-v1-3.vercel.app) &nbsp;·&nbsp; [**Report a Bug**](https://github.com/akrist-rai/ephemeral_v1.3/issues) &nbsp;·&nbsp; [**Contributing Guide**](./CONTRIBUTING.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Domains](#domains)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Adding Content](#adding-content)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [CI/CD](#cicd)

---

## Overview

**EPHEMERAL** is a story-driven, multi-domain learning platform structured around anime-inspired **Arcs**. Each arc covers a distinct STEM discipline and uses a teaching and testing format tailored to that domain:

| Domain | Arc | Teaching Style | Test Format |
|:---|:---|:---|:---|
| Algorithms / DSA | The Eclipse | Conceptual + visual | Problem solving |
| Cybersecurity | Grand Line | Narrative + forensics | CTF flag submission |
| Machine Learning | JOHANS LAB | Visual explainers | Conceptual Q&A |
| Networks | The Knot | Protocol diagrams | CTF + analysis |
| Data Structures | Prophecy | Visual explainers | Problem solving |
| Competitive Prog | ONE PUNCH | Timed challenges | CP-style |
| Mathematics | UNIT-01 | Proof-based | Derivation Q&A |

The scoring system degrades per wrong attempt (**100 → 70 → 40 pts**), punishing brute-force and rewarding careful analysis. Progress is tracked globally on a live leaderboard.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│   React 19 · Vite 8 · TypeScript · Vanilla CSS (CRT layer)   │
│                                                               │
│   parseRoute() → screen component → data from /api/*         │
└────────────────────────┬─────────────────────────────────────┘
                         │  HTTP  /api/*
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              VERCEL SERVERLESS  (api/index.ts)                │
│                                                               │
│   ┌─────────────────────────────────────────────────────┐    │
│   │                  Koa.js Pipeline                     │    │
│   │  errorHandler → requestId → responseTime → logger    │    │
│   │  → helmet/cors → rateLimit → bodyGuard → router      │    │
│   │                                                      │    │
│   │  GET  /api/arcs, /api/episodes/:arcId                │    │
│   │  GET  /api/episodes/:arcId/:episodeId/challenges     │    │
│   │  GET  /api/progress/:userId                          │    │
│   │  POST /api/submit   ← flag validation + scoring      │    │
│   │  GET  /api/leaderboard, /api/stats/*                 │    │
│   └───────────────────────┬─────────────────────────────┘    │
│                           │  Drizzle ORM (neon-http)          │
│                           ▼                                   │
│   ┌─────────────────────────────────────────────────────┐    │
│   │          Neon Serverless Postgres                     │    │
│   │  users · arcs · episodes · challenges · progress     │    │
│   └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

**Key flows:**

- **Dev:** Vite proxies `/api/*` → `localhost:3010` (backend started via `bun run dev:full`)
- **Prod:** `vercel.json` routes `/api/*` → `api/index.ts`; all other paths → `index.html`
- **Flag submission:** `POST /api/submit` compares the submitted flag (normalised to uppercase) against the DB record inside a DB transaction that atomically updates progress and awards XP
- **Content:** Arcs, episodes, and challenges live in `src/data/content.ts` and are seeded to the DB via `bun run db:seed`. `EPISODE_RESOURCES` is static — used by the frontend directly without a DB round-trip

---

## Tech Stack

| Layer | Technology | Notes |
|:---|:---|:---|
| **UI** | React 19, Vite 8, TypeScript | Strict mode, zero UI library dependency |
| **Styling** | Vanilla CSS | CRT scanline + phosphor glow, CSS variables for accent colors |
| **Server** | Koa 2, @koa/router | Exported as a single Vercel serverless function |
| **ORM** | Drizzle ORM | Type-safe, schema-first, Neon HTTP driver |
| **Database** | Neon Serverless Postgres | Scales to zero, branching for preview environments |
| **Runtime** | Bun | Dev server, seed script, script runner |
| **Security** | koa-helmet, @koa/cors, Zod | CSP/HSTS, typed request validation |
| **DevOps** | GitHub Actions, Vercel | CI on push + zero-config deploy on merge |

---

## Project Structure

```
ephemeral_v1.3/
├── api/
│   └── index.ts              # Vercel entrypoint — exports Koa app.callback()
├── src/
│   ├── config/
│   │   └── index.ts          # Env vars, scoring multipliers, rate-limit config
│   ├── controllers/
│   │   ├── content.controller.ts  # Arc / episode / challenge read endpoints
│   │   ├── user.controller.ts     # Progress, flag submission, leaderboard
│   │   ├── stats.controller.ts    # Solve counts, first-blood, activity feed
│   │   └── system.controller.ts   # Health check, ping
│   ├── data/
│   │   ├── content.ts        # SOURCE OF TRUTH: ARCS, EPISODES, CHALLENGES, EPISODE_RESOURCES
│   │   ├── codex.ts          # Per-category reference cards (CTF cheatsheets)
│   │   └── ctfChapters.ts    # Guided chapter definitions for specific challenges
│   ├── db/
│   │   ├── schema.ts         # Drizzle table definitions (users/arcs/episodes/challenges/progress)
│   │   ├── index.ts          # Neon connection + health check helper
│   │   └── migrate-and-seed.ts
│   ├── hooks/
│   │   ├── useApi.ts         # fetch wrapper with loading/error state + apiRequest helper
│   │   └── useCtf.ts         # CTF flag submission state machine
│   ├── lib/
│   │   ├── errors.ts         # AppError hierarchy (NotFoundError, ValidationError, …)
│   │   ├── imageMapping.ts   # Arc cover + episode thumbnail paths (public/one_piece/)
│   │   ├── logger.ts         # Coloured structured logger (component-scoped)
│   │   ├── response.ts       # ok() / error() / paginated() response helpers
│   │   └── sound.ts          # Web Audio API sound effects
│   ├── middleware/
│   │   ├── index.ts          # requestId, responseTime, errorHandler, rateLimit, …
│   │   └── validate.ts       # Zod-backed request validation middleware
│   ├── routes/
│   │   └── index.ts          # All /api/* routes with validation wired
│   ├── services/
│   │   ├── arc.service.ts
│   │   ├── challenge.service.ts   # PUBLIC_COLUMNS strips flag from client responses
│   │   ├── episode.service.ts
│   │   ├── leaderboard.service.ts
│   │   ├── progress.service.ts    # solveWithXp() runs in a DB transaction
│   │   ├── stats.service.ts
│   │   └── user.service.ts
│   ├── types.ts              # Shared frontend types (Arc, Episode, Challenge, …)
│   ├── types/index.ts        # Backend API types (ApiResponse, SubmitFlagResult, …)
│   ├── validators/index.ts   # Zod schemas for all request bodies/params/queries
│   ├── server.ts             # Koa app assembly + graceful shutdown
│   ├── seed.ts               # DB seed script (reads from src/data/content.ts)
│   └── App.tsx               # Single-file SPA router (parseRoute + screen dispatch)
├── public/
│   ├── one_piece/            # 1–101.jpeg — arc covers (1-8), episode thumbnails, UI backgrounds
│   └── avatar/               # Player avatar images
├── CLAUDE.md                 # AI assistant instructions for this repo
├── CONTENT_GUIDE.md          # Step-by-step guide for adding arcs/episodes/challenges
├── drizzle.config.ts
├── vite.config.ts
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) `>= 1.0`
- A [Neon](https://neon.tech) project (free tier is sufficient)
- Node.js `>= 18` (for Vite and drizzle-kit)

### Installation

```bash
# Clone
git clone https://github.com/akrist-rai/ephemeral_v1.3.git
cd ephemeral_v1.3

# Install
bun install

# Configure
cp .env.example .env
# → Set DATABASE_URL to your Neon connection string

# Push schema
bun run db:push

# Seed content (arcs, episodes, challenges)
bun run db:seed

# Start full dev environment (frontend :5173, API :3010)
bun run dev:full
```

---

## Adding Content

All platform content — arcs, episodes, challenges, and curated resources — lives in **`src/data/content.ts`**.

```
1. Edit src/data/content.ts
2. bun run db:seed          ← re-seeds arcs/episodes/challenges (EPISODE_RESOURCES is frontend-only, no seed needed)
```

> **Important:** `db:seed` is destructive — it purges all rows from `progress`, `challenges`, `episodes`, and `arcs` before inserting. User XP is lost. Run it only in dev or when you explicitly want a full reset.

See **[CONTENT_GUIDE.md](./CONTENT_GUIDE.md)** for the full field reference and examples.

### Image assets

All episode and arc images live in `public/one_piece/` as sequentially numbered `.jpeg` files:

| Range | Purpose |
|:---|:---|
| `1–8` | Arc cover images |
| `9–16` | Arc 1 (Algorithms) episode thumbnails |
| `17–24` | Arc 2 (Cybersecurity) episode thumbnails |
| `25–32` | Arc 3 (Machine Learning) episode thumbnails |
| `33–40` | Arc 4 (Networks) episode thumbnails |
| `41–48` | Arc 5 (Data Structures) episode thumbnails |
| `49–56` | Arc 6 (Competitive Prog) episode thumbnails |
| `57–64` | Arc 7 (Mathematics) episode thumbnails |
| `65–72` | Arc 8 (Probability) episode thumbnails |
| `73–78` | Legacy Arc 3 IDs |
| `79–83` | UI background images |
| `86–101` | Arc 9 (Initiation) episode thumbnails + spares |

The mapping from episode ID → image path is in **`src/lib/imageMapping.ts`**.

Player avatars live in `public/avatar/` and are served via `GET /api/avatars`.

---


