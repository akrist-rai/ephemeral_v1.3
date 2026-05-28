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
