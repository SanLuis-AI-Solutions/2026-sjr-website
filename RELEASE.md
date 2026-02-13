# RELEASE.md

## 0.1.0 - 2026-01-31
- Next.js App Router scaffold (TS + Tailwind)
- Initial SJR homepage and core pages

## Deployment (Do This Every Time)
Vercel Git integration can fail silently (no deploys on push). To prevent that, we keep a deterministic
deploy path that does not depend on Vercel's Git hooks.

1. Run verification:

```powershell
pwsh -File scripts/verify.ps1
```

2. Deploy to production (refuses dirty/unpushed work):

```powershell
pwsh -File scripts/deploy-prod.ps1
```

3. Confirm the latest Vercel deployment SHA matches `git rev-parse HEAD`.

## CI Deploy (Recommended)
There is a GitHub Action at `.github/workflows/deploy-production.yml` that deploys on pushes to `master`.

Required repo secret:
- `VERCEL_TOKEN`

## Template
- Version:
- Date:
- Changes:
- Deployment steps:
- Verification:
- Rollback plan:

