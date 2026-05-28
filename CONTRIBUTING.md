# Contributing to EPHEMERAL

```
[ RUHENHEIM ACCESS PROTOCOL — CONTRIBUTOR CLEARANCE REQUIRED ]
```

Thank you for your interest in EPHEMERAL. This document covers how to add new challenges, report issues, and submit pull requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs](#reporting-bugs)
- [Development Setup](#development-setup)
- [Adding a New Challenge](#adding-a-new-challenge)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

---

## Code of Conduct

Be direct and respectful. Assume good intent. Don't waste people's time with low-effort contributions.

---

## Reporting Bugs

Before opening an issue, check whether the bug has already been reported. When filing:

- **Title:** Short, specific (`Flag submission returns 500 on empty input` — not `it's broken`)
- **Steps to reproduce:** Numbered, minimal
- **Expected vs. actual behavior**
- **Environment:** OS, Bun version, browser (if frontend)

---

## Development Setup

Follow the [Getting Started](./README.md#getting-started) steps in the README.

Useful commands during development:

```bash
bun run dev        # Backend only (Koa, port 3000, hot-reload)
bun run dev:ui     # Frontend only (Vite, port 5173)
bun run dev:full   # Both concurrently

bun run db:push    # Push schema changes to Neon
bun run db:seed    # Re-seed challenge data
```

---

## Adding a New Challenge

Every challenge in EPHEMERAL is a ML forensics puzzle. New challenges should feel like real investigative work — gradient logs, broken weight files, corrupted manifests, anomalous training curves.

### 1. Design the scenario

A good challenge has:

- **A concrete artifact** — a file, a log dump, a JSON payload, a base64 blob
- **A genuine ML concept** — gradient explosion, dead ReLUs, weight entanglement, NaN loss, etc.
- **A solvable path** — the player should be able to derive the flag through analysis, not guessing
- **Flavor text** — lore-consistent, cryptic but fair

### 2. Add the challenge to the seed file

Open `src/seed.ts` and add an entry:

```typescript
{
  id: 'challenge_id',           // unique slug, lowercase_snake
  title: 'GRADIENT_GHOST',      // uppercase, thematic
  category: 'forensics',        // forensics | crypto | reverse | misc
  difficulty: 'medium',         // easy | medium | hard | insane
  points: 200,
  description: `
    A training run from Ruhenheim Node 7 was interrupted mid-epoch.
    The gradient log below was recovered. Something is very wrong.
    ...
  `,
  flag: 'EPH{your_flag_here}',  // format: EPH{...}
  artifact: { ... },            // any JSON-serialisable payload
}
```

### 3. Flag format

All flags must follow the format: `EPH{<content>}`

Content should be:
- Derivable from the challenge artifact via analysis
- Not guessable without solving the challenge
- Not a raw hash (include some human-readable component)

### 4. Test locally

```bash
bun run db:seed   # re-seed with your new challenge
bun run dev:full  # verify it renders and validates correctly
```

---

## Pull Request Process

1. Fork the repo and create a branch from `main`:
   ```bash
   git checkout -b feat/challenge-gradient-ghost
   ```

2. Make your changes. If you're adding a challenge, include the seed entry and any static artifacts.

3. Ensure CI passes locally:
   ```bash
   bunx tsc --noEmit
   bun run build
   ```

4. Open a PR against `main`. Include:
   - What the change does
   - If it's a new challenge: the difficulty, category, and a spoiler-free description of the solve path
   - Screenshots if it touches the UI

5. PRs are reviewed within a few days. Expect feedback on challenge quality, flag derivability, and lore consistency.

---

## Style Guide

### TypeScript

- Strict mode is enforced. No `any`, no `@ts-ignore` without a comment explaining why.
- Prefer `type` over `interface` for local shapes. Use `interface` for public API contracts.
- Async route handlers must handle errors — wrap with `try/catch` or use the error middleware.

### CSS

- All new styles go in `src/styles/`. Match the existing CRT/phosphor aesthetic.
- No external UI component libraries. Vanilla CSS only.
- Use CSS custom properties (`--var`) for any color or spacing that appears more than once.

### Commit messages

Follow conventional commits loosely:

```
feat: add GRADIENT_GHOST challenge
fix: flag validation rejecting valid EPH{} format
chore: update drizzle-kit to 0.21
```

---

```
// END OF CONTRIBUTOR PROTOCOL // RUHENHEIM_511
```
