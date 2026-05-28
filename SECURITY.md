# Security Policy

```
[ RUHENHEIM SECURITY CLEARANCE — REPORT PROTOCOL ]
```

## Supported Versions

| Version | Supported |
|:---|:---:|
| v1.3.x (current) | ✅ |
| < v1.3 | ❌ |

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a vulnerability in EPHEMERAL — particularly anything that could allow:

- Flag extraction without solving the challenge (server-side bypass)
- Arbitrary SQL execution or database access
- Authentication/session bypass
- API abuse that corrupts scoreboard state

Please report it privately by opening a [GitHub Security Advisory](https://github.com/akrist-rai/ephemeral_v1.3/security/advisories/new) or emailing the maintainer directly.

Include:
- A description of the issue and its potential impact
- Steps to reproduce
- Any suggested remediation

You can expect an acknowledgement within **72 hours** and a fix timeline within **7 days** for critical issues.

---

## Scope

### In scope

- Flag validation logic in `api/index.ts` / `src/server.ts`
- SQL injection or ORM misuse in Drizzle queries
- CORS misconfiguration allowing cross-origin flag submission
- Insecure direct object references in challenge endpoints
- Environment variable leakage in client-side bundles

### Out of scope

- Brute-forcing flags (the degrading-points system is the intended mitigation)
- Vercel or Neon infrastructure vulnerabilities (report directly to them)
- Self-XSS or issues requiring physical access to the victim's device
- Bugs in third-party dependencies not introduced by this project

---

## Security Design Notes

For contributors and auditors:

- Flags are stored server-side only and never included in the challenge manifest sent to the client.
- All flag comparisons are done with constant-time string comparison to avoid timing attacks.
- `koa-helmet` enforces a strict CSP, HSTS, and `X-Content-Type-Options` on all API responses.
- `DATABASE_URL` is loaded exclusively server-side via `dotenv` and is never exposed to the Vite build.

---

```
// END OF SECURITY PROTOCOL // RUHENHEIM_511
```
