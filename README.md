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
║          M A C H I N E · L E A R N I N G · C T F           ║
║                                                              ║
║         K·I·N·D·E·R·H·E·I·M  ·  5·1·1  ·  J·O·H·A·N       ║
║                   [ RUHENHEIM_NODE ]                         ║
╚══════════════════════════════════════════════════════════════╝
```

**A high-fidelity, machine-learning–themed Capture The Flag platform.**  
Investigate broken models. Analyze gradient norms. Derive flags from architectural evidence.

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
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [CI/CD](#cicd)
- [Contributing](#contributing)

---

## Overview

**EPHEMERAL** is a CTF platform built around a fictional ML research lab called *Ruhenheim*. Players are cast as investigators analysing corrupted model artifacts, anomalous gradient logs, and fragmented weight files to extract hidden flags. Every challenge is a forensic puzzle — rooted in real ML concepts — wrapped in a persistent CRT-terminal aesthetic.

The scoring system degrades with each wrong attempt (100% → 70% → 40%), punishing brute-force and rewarding careful analysis. Progress is tracked in real-time via an in-app HUD showing XP, rank, and solved count.

---

## Features

| | Feature | Description |
|---|---|---|
| 🎯 | **Server-side Flag Validation** | Flags are sanitized and verified against the database — no client-side leaks. |
| 📉 | **Degrading Points** | Score decays per incorrect submission: 100 → 70 → 40 pts. |
| 📡 | **Real-time HUD** | Live XP, rank, and solve-count overlay rendered without page reloads. |
| 🔐 | **Koa-Helmet Security** | HTTP security headers enforced on every API response. |
| ⚡ | **Serverless Ready** | Single Koa entrypoint compiled to a Vercel serverless function. |
| 🔁 | **CI/CD Pipeline** | Automated build + type-check on every push and pull request. |
| 🎨 | **CRT Aesthetics** | Vanilla CSS scanline/phosphor effects — zero runtime overhead. |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│              React 19 + Vite + TypeScript                     │
│              Vanilla CSS  ·  CRT Aesthetic Layer              │
└────────────────────────┬─────────────────────────────────────┘
                         │  HTTP  /api/*
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  VERCEL SERVERLESS FUNCTION                   │
│                      api/index.ts                             │
│                                                               │
│   ┌─────────────────────────────────────────────────────┐    │
│   │              Koa.js Application                      │    │
│   │  koa-router · koa-bodyparser · koa-helmet · CORS     │    │
│   │                                                      │    │
│   │  POST /api/submit   ←  flag validation + scoring     │    │
│   │  GET  /api/challenges  ←  challenge manifest         │    │
│   │  GET  /api/progress    ←  user XP / solve state      │    │
│   └───────────────────────┬─────────────────────────────┘    │
│                           │  Drizzle ORM                      │
│                           ▼                                   │
│   ┌─────────────────────────────────────────────────────┐    │
│   │              Neon Serverless Postgres                 │    │
│   │         challenges · submissions · users             │    │
│   └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

**Request flow:**

1. Vite dev server proxies `/api/*` → `localhost:3000` in development.
2. In production, `vercel.json` rewrites `/api/*` → `api/index.ts` serverless function.
3. All other routes rewrite to `index.html`, keeping client-side routing intact.

---

## Tech Stack

| Layer | Technology | Notes |
|:---|:---|:---|
| **UI** | React 19, Vite 8, TypeScript | Strict mode, no UI library |
| **Styling** | Vanilla CSS | CRT scanline + phosphor glow effects |
| **Server** | Koa 2, Koa-Router | Compiled to a single Vercel function |
| **ORM** | Drizzle ORM | Type-safe, schema-first, zero query builder |
| **Database** | Neon Serverless Postgres | Branching, scales to zero |
| **Runtime** | Bun | Dev server, seeding, script runner |
| **Security** | Koa-Helmet, @koa/cors | CSP, HSTS, XSS headers |
| **DevOps** | GitHub Actions, Vercel | CI on push + auto-deploy on merge |

---

## Project Structure

```
ephemeral_v1.3/
├── api/
│   └── index.ts            # Vercel serverless entrypoint (wraps Koa)
├── src/
│   ├── db/
│   │   ├── schema.ts       # Drizzle table definitions
│   │   └── client.ts       # Neon connection + Drizzle instance
│   ├── routes/             # Koa route handlers
│   ├── middleware/         # Auth, error handling, rate limiting
│   ├── components/         # React UI components
│   ├── pages/              # Page-level components
│   ├── styles/             # Global CSS + CRT effect layers
│   ├── seed.ts             # Database seeding script
│   └── server.ts           # Core Koa app (exported for serverless)
├── .github/
│   └── workflows/
│       └── ci.yml          # Build + type-check pipeline
├── drizzle.config.ts       # Drizzle-Kit config (schema → Neon)
├── vite.config.ts          # Vite + /api proxy config
├── vercel.json             # Routing: static ↔ serverless
├── .env.example            # Required environment variables
└── package.json
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) `>= 1.0`
- A [Neon](https://neon.tech) project (free tier works fine)
- Node.js `>= 18` (for tooling compatibility)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/akrist-rai/ephemeral_v1.3.git
cd ephemeral_v1.3

# 2. Install dependencies
bun install

# 3. Configure environment
cp .env.example .env
# → Open .env and paste your Neon DATABASE_URL

# 4. Push schema to database
bun run db:push

# 5. Seed challenge data
bun run db:seed

# 6. Start the full dev environment (frontend + backend)
bun run dev:full
```

The frontend is available at `http://localhost:5173`.  
The API runs at `http://localhost:3000` (proxied through Vite automatically).

---

## Deployment

This project is pre-configured for zero-config deployment to Vercel.

### Steps

**1. Push to GitHub** — ensure `vercel.json`, `api/index.ts`, and the Vite build config are present.

**2. Import the repository on Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Select `akrist-rai/ephemeral_v1.3`
- Framework preset: **Vite** (auto-detected)

**3. Add the environment variable**

| Variable | Value |
|:---|:---|
| `DATABASE_URL` | Your Neon connection string (from Neon console → Connection Details) |

**4. Deploy** — Vercel will build the frontend and expose `api/index.ts` as a serverless function. Every future push to `main` triggers an automatic redeploy.

> **Preview Environments:** Pull Requests automatically get a unique preview URL, sharing the same production database unless you configure a separate Neon branch.

### Database migrations

Schema changes should be applied manually before merging:

```bash
# Apply schema diff to production
DATABASE_URL=<prod_url> bun run db:push
```

---

## Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `DATABASE_URL` | ✅ | Neon Postgres connection string (`postgresql://...`) |

See [`.env.example`](./.env.example) for the full template.

---

## CI/CD

GitHub Actions runs on every push to `main` and every pull request:

```
push / PR to main
       │
       ├── bun install --frozen-lockfile
       ├── tsc --noEmit          (type-check)
       └── bun run build         (Vite production build)
```

Vercel handles continuous deployment independently — a green CI check is not a deploy gate by default, but you can enforce it via [Vercel's GitHub integration settings](https://vercel.com/docs/deployments/git/vercel-for-github).

---

## Contributing

See [**CONTRIBUTING.md**](./CONTRIBUTING.md) for guidelines on adding new challenges, reporting bugs, and the pull request process.

---

<div align="center">

```
// THE MONSTER WITHOUT A NAME // RUHENHEIM_511
```

*SUBJECT_ALPHA · KINDERHEI·M 511 · J·O·H·A·N*

</div>
=======
# ⟁ EPHEMERAL CTF ENGINE

```text
┌──────────────────┐
│ ░░░░░░░░░░░░░░░ │
│ ░  ─── ─── ░ │
│ ░░░░ ᵕ ░░░░ │
│ ░  ─────── ░ │
│ ░░░░░░░░░░░░░░░ │
│                  │
│  K · I · N · D  │
│  E · R · H · E  │
│  I · M  5 1 1   │
└──────────────────┘
   J·O·H·A·N
──────────────────
  SUBJECT_ALPHA
 RUHENHEIM_NODE
```

**EPHEMERAL** is a high-fidelity, machine learning-themed Capture The Flag (CTF) platform. Investigate broken models, analyze gradient norms, and derive flags from architectural evidence.

## ⚡ QUICK START

```bash
# Install dependencies
bun install

# Setup Database (Neon Postgres)
bun run db:push
bun run db:seed

# Start Development Environment (Frontend + Backend)
bun run dev:full
```

## 🏗 ARCHITECTURE

- **Frontend:** React 19 + Vite + TypeScript (Vanilla CSS for high-performance CRT aesthetics)
- **Backend:** Koa.js (Node.js)
- **Database:** Drizzle ORM + Neon (Serverless Postgres)
- **Deployment:** Vercel Serverless Functions

## 🚀 FEATURES

- **Real-time Progress:** Integrated HUD tracking user XP and solved challenges.
- **Server-side Validation:** Flags are sanitized and validated against a secure backend.
- **Degrading Points:** Score is calculated based on attempts (100% → 70% → 40%).
- **Serverless Ready:** Optimized for Vercel with a single entrypoint for the entire API.
- **CI/CD:** Automated build checks via GitHub Actions.

## 🛠 TECH STACK

| Layer | Technology |
| :--- | :--- |
| **UI** | React, Vite |
| **Server** | Koa, Koa-Router |
| **Database** | Drizzle ORM, Neon Postgres |
| **Security** | Koa-Helmet, CORS |
| **DevOps** | Bun, Concurrently, GitHub Actions |

## 📦 DEPLOYMENT

1. Push to GitHub.
2. Link repository to Vercel.
3. Add `DATABASE_URL` to Vercel Environment Variables.
4. Deploy.

---
*// THE MONSTER WITHOUT A NAME // RUHENHEIM_511*
>>>>>>> 6f9336f (initial commit: ephemeral ctf engine v1.0)
