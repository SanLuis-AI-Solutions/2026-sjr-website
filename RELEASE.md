# RELEASE.md

## 0.1.0 - 2026-01-31
- Next.js App Router scaffold (TS + Tailwind)
- Initial SJR homepage and core pages

## Deployment (Do This Every Time)
GitHub `master` is the source of record. Production deploys should come from a push to `master`,
which triggers `.github/workflows/deploy-production.yml` and deploys to Vercel with the repo's
stored token.

1. Run verification:

```powershell
pwsh -File scripts/verify.ps1
```

2. Push the verified change to `master`.

3. Confirm these GitHub Actions run for that commit:
- `build-and-smoke`
- `Deploy Production (Vercel)`

4. Confirm production is serving the new commit.

## Emergency Fallback Only
Use the local production deploy script only if GitHub Actions is unavailable and production must be fixed immediately.
If you use it, sync the exact deployed commit back to GitHub right after.

```powershell
pwsh -File scripts/deploy-prod.ps1
```

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

