# Codex Instructions: Blog Routing 404 Investigation

> Update on 2026-04-21: production verification does not support a site-wide blog-routing failure.
> The triggering 404 came from `/blog/how-much-does-jewelry-repair-cost-pasadena`, a slug that does not exist in `src/lib/blog.ts`.
> Real published blog URLs are returning `200` on production.
> Use this guide only if a **real published slug** begins failing.

**Priority:** 🔴 CRITICAL - Production Blocker  
**Timeline:** Must complete same day (Apr 21)  
**Owner:** Codex  
**Objective:** Determine why some blog articles return 404 on production, then fix

---

## Quick Context

GSC inspection found that `/blog/[slug]` articles are returning 404 errors when Google's live crawl test fetches them from production. This blocks:
- All blog content from being indexed
- Phase 3B SEO strategy entirely
- Batch 6 freshness signal investment

You need to identify the root cause and fix it TODAY.

---

## Investigation Checklist

### Step 1: Verify Blog Article Accessibility (15 min)

**What to test:** Can we actually access blog articles from production?

```bash
# 1a. Test 3 different blog articles in browser (not localhost)
# Use the URLs from the sitemap:
# - https://www.susiesjewelryrepair.com/blog/how-much-does-jewelry-repair-cost-pasadena
# - https://www.susiesjewelryrepair.com/blog/can-a-severely-bent-ring-prong-be-fixed
# - https://www.susiesjewelryrepair.com/blog/chain-repair-weak-points

# 1b. For each URL, check:
#   - Does it load? (200 status)
#   - Does it show content or blank page?
#   - Is it a 404 error page?
#   - Is it a redirect loop?

# 1c. Check production logs
# - Go to Vercel dashboard
# - Find recent deployments
# - Check if /blog/* routes are listed in build output
# - Look for any 404 errors in function logs

# 1d. Compare with staging/dev
# - Test same URLs on staging environment
# - Are they accessible on staging but not production?
```

**Expected Result:** Identify if 404 is consistent across all blog articles or only some.

---

### Step 2: Inspect Blog Route Configuration (10 min)

**File:** `src/app/blog/[slug]/page.tsx`

```bash
# 2a. Check if the route file exists
ls -la src/app/blog/

# 2b. Verify route structure
# Should be:
# src/app/blog/
#   ├── [slug]/
#   │   └── page.tsx
#   └── layout.tsx

# 2c. Check dynamic route implementation
# Open src/app/blog/[slug]/page.tsx and verify:
#   - exports async function generateStaticParams() ?
#   - exports async function generateMetadata() ?
#   - Has proper getPost(slug) or similar call?
#   - Handles 404 notFound() if slug doesn't exist?
```

**Key Question:** Is the route file properly configured for dynamic routes in Next.js 14+?

---

### Step 3: Verify Blog Data Source (10 min)

**File:** `src/lib/blog.ts`

```bash
# 3a. Check blog article definitions
# Open src/lib/blog.ts and verify:
#   - Has all the blog slugs defined (can-a-severely-bent-ring-prong-be-fixed, etc.)
#   - Slugs match the URLs in sitemap.xml
#   - Blog articles are exported/accessible

# 3b. Verify export
# grep -n "export" src/lib/blog.ts
# Should see exports like:
#   export const BLOG_POSTS = [...]
#   export async function getPost(slug) { ... }

# 3c. Check for slug mismatch
# Get list of slugs from sitemap:
grep "/blog/" sitemap.xml | sed 's/.*\/blog\///' | sed 's/<.*//' | sort

# Get list of slugs from blog.ts:
grep "slug:" src/lib/blog.ts | grep -o "'[^']*'" | sort

# Do these lists match?
```

**Key Question:** Are the blog article definitions available at runtime?

---

### Step 4: Check Deployment Build Output (15 min)

**Location:** Vercel Dashboard → Recent Deployment

```bash
# 4a. Go to Vercel > Deployments > Latest Production
# Look at "Build Logs" tab

# 4b. Search for:
#   - "blog" (are blog routes being built?)
#   - "generateStaticParams" (is static generation working?)
#   - Any errors like "Module not found" or "ENOENT"
#   - Warnings about missing files

# 4c. Check if routes are listed in build output
# Look for lines like:
#   ✓ /blog/[slug] (Dynamic)
#   or
#   ○ /blog/[slug] (Static)

# 4d. If routes are missing:
#   - Blog routes may not be compiled into production
#   - Check if Next.js app router is configured correctly
#   - Verify tsconfig.json paths

# 4e. Check .next/routes-manifest.json (if accessible)
# This file shows all compiled routes
```

**Key Question:** Are `/blog/[slug]` routes being compiled into the production build?

---

### Step 5: Investigate Environment-Specific Issues (10 min)

```bash
# 5a. Check for environment variables in blog route
# grep -r "process.env" src/app/blog/
# grep -r "process.env" src/lib/blog.ts

# 5b. Look for hardcoded localhost or dev URLs
# grep -r "localhost" src/app/blog/
# grep -r "localhost" src/lib/blog.ts

# 5c. Check if blog route uses database/API that might not be available in prod
# Are there Supabase calls in the route?
# Are they properly configured for production?

# 5d. Verify NEXT_PUBLIC_* variables are set in Vercel
# Go to Vercel > Settings > Environment Variables
# Check if any BLOG_* or CONTENT_* variables exist
# Are they set for production?
```

**Key Question:** Is production missing environment variables or config that blog routes need?

---

## Root Cause Decision Tree

**If blog articles load fine in browser (200 status):**
→ Issue is NOT production routing, possibly GSC cache/crawl issue
→ Action: Resubmit to GSC + verify Google can crawl

**If blog articles return 404 in browser:**
→ Routing issue confirmed in production
→ Next question: Is it all articles or just some?

  **If ALL blog articles return 404:**
  → Route file missing or not compiled
  → Action: Check `src/app/blog/[slug]/page.tsx` exists + rebuild

  **If SOME blog articles return 404:**
  → Slug mismatch or data loading issue
  → Action: Compare sitemap slugs vs blog.ts slugs, fix mismatch

**If articles load on staging but 404 on production:**
→ Environment-specific issue
→ Action: Check Vercel env vars + build logs for differences

---

## Fix Workflow (Based on Root Cause)

### Fix A: Route File Missing/Not Compiled

```bash
# 1. Verify file exists
ls -la src/app/blog/[slug]/page.tsx

# 2. If missing: Check git history
git log --oneline -- src/app/blog/[slug]/page.tsx

# 3. If recently deleted: Restore from git
git checkout HEAD~1 -- src/app/blog/[slug]/page.tsx

# 4. Ensure route is exported properly
# Should have: export default function BlogPost() { ... }

# 5. Rebuild and redeploy
git add .
git commit -m "fix: restore blog dynamic route"
git push
# Wait for Vercel deployment to complete
```

### Fix B: Slug Mismatch

```bash
# 1. Get expected slugs from sitemap
grep "/blog/" sitemap.xml | sed 's/.*\/blog\///' | sed 's/<.*//' > expected-slugs.txt

# 2. Get actual slugs from blog.ts
grep "slug:" src/lib/blog.ts | grep -o "'[^']*'" | tr -d "'" > actual-slugs.txt

# 3. Find mismatches
comm -23 <(sort expected-slugs.txt) <(sort actual-slugs.txt)

# 4. Update blog.ts to match
# Or regenerate sitemap to match blog.ts

# 5. Verify match and redeploy
git add src/lib/blog.ts
git commit -m "fix: align blog slugs with sitemap"
git push
```

### Fix C: Environment Variable Missing

```bash
# 1. Get missing variable name from error logs
# e.g., process.env.SUPABASE_URL

# 2. Go to Vercel > Settings > Environment Variables

# 3. Add variable for production
# Name: SUPABASE_URL
# Value: [actual value]
# Environments: Production ✓

# 4. Redeploy from Vercel dashboard
# (git push triggers new deploy)

git add .
git commit -m "fix: blog route env vars (manual Vercel config)"
git push
```

---

## Verification (After Fix)

### Step 1: Manual Browser Test

```bash
# Test 3 different blog articles
# Should all return 200 and show content

curl -I https://www.susiesjewelryrepair.com/blog/how-much-does-jewelry-repair-cost-pasadena
# Expected: HTTP/2 200

curl -I https://www.susiesjewelryrepair.com/blog/can-a-severely-bent-ring-prong-be-fixed
# Expected: HTTP/2 200
```

### Step 2: Google Search Console Verification

```bash
# Go to GSC > URL Inspection
# Test the same blog URL that showed 404 before

# Expected result:
# ✅ URL is on Google
# ✅ Page indexing: Page is indexed
# ✅ Page fetch: Successful
```

### Step 3: Resubmit Affected URLs

```bash
# Go to GSC > Sitemaps
# Click on sitemap.xml

# Check if discovery increased (before/after fix)
# Click "Request indexing" on a blog URL
# Verify it processes successfully
```

---

## Success Criteria

✅ All blog articles accessible in browser (return 200)  
✅ Google's live crawl test shows successful page fetch  
✅ GSC inspection shows blog article as "Page is indexed"  
✅ No 404 errors in Vercel logs  

**Once verified:** Report back to main team with:
- Root cause summary
- Fix applied
- Resubmission status
- Estimated time until blog articles appear in search results

---

## Escalation (If Stuck)

If after 30 minutes you can't identify the root cause:

1. Check Vercel deployment logs for errors
2. Compare git history of last working state vs current
3. Check if Next.js version was recently updated (may affect routing)
4. Ask: Did blog articles EVER work on production? Or is this new?
5. If truly stuck: Revert last 3 commits and redeploy to rule out recent changes

**Do not spend >1 hour on investigation.** If root cause unclear, revert to last known good state + rebuild.
