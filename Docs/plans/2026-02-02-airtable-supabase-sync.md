# Airtable → Supabase → Site Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Validate the Airtable base, reconcile any schema gaps, and wire Airtable content into Supabase and the Next.js site with publish-safe syncing.

**Architecture:** Airtable remains the editorial source-of-truth. A sync script pulls Airtable metadata + records and upserts into Supabase tables. The site reads from Supabase (server-side), with constants as fallback until data is complete.

**Tech Stack:** Next.js 16, Node.js (fetch), Supabase REST/SDK, Airtable Metadata + Data APIs.

---

### Task 0: Worktree + Env Setup

**Files:**
- Modify: `.env.local` (only if missing keys)
- Create: `docs/plans/2026-02-02-airtable-supabase-sync.md`

**Step 1: Create a dedicated worktree**

Run: `git worktree add ../sjr-airtable-sync`
Expected: new worktree created.

**Step 2: Verify env vars exist**

Run: `rg -n "AIRTABLE_PAT_TOKEN|SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY" .env.local`
Expected: Airtable token present; Supabase values may be missing and will be requested.

---

### Task 1: Airtable Schema Validation

**Files:**
- Create: `scripts/airtable/schema-spec.json`
- Create: `scripts/airtable/validate-schema.mjs`
- Modify: `package.json`

**Step 1: Add schema spec**

```json
{
  "baseId": "app6ogTLP23Fy37bR",
  "tables": {
    "Services": [
      "name","slug","category","short_summary","long_description","includes","common_requests","faqs","price_note","priority","active","meta_title","meta_description","geo_city","geo_state","geo_area","updated_at"
    ],
    "FAQs": ["question","answer","service","priority","active"],
    "Testimonials": ["customer_name","quote","rating","service","location","active","sort"],
    "Gallery": ["title","image","alt_text","service","category","active","sort"],
    "Blog": ["title","slug","excerpt","body","hero_image","tags","publish_date","status","meta_title","meta_description"],
    "Site Settings": ["key","value","notes"]
  }
}
```

**Step 2: Implement validator**

- Fetch Airtable metadata: `GET https://api.airtable.com/v0/meta/bases/{baseId}/tables`
- Compare table names + field names vs spec.
- Print missing/extra fields and exit non‑zero on mismatch.

**Step 3: Add npm script**

Add to `package.json`:
- `"airtable:validate": "node scripts/airtable/validate-schema.mjs"`

**Step 4: Run validator**

Run: `npm run airtable:validate`
Expected: PASS or a clear list of missing fields/tables.

---

### Task 2: Airtable Schema Fixes (if needed)

**Files:**
- Modify: `scripts/airtable/validate-schema.mjs` (to include optional fix output)
- Optional: `scripts/airtable/patch-schema.mjs`

**Step 1: If validation fails, generate a fix list**

- Output exact fields missing by table.
- Provide manual instructions or generate a patch script using Airtable Metadata API.

**Step 2: Apply fixes**

Option A (Manual): Update tables/fields in Airtable UI.
Option B (Scripted): Use Metadata API to create missing fields.

**Step 3: Re-run validator**

Run: `npm run airtable:validate`
Expected: PASS.

---

### Task 3: Supabase Schema + Sync Pipeline

**Files:**
- Create: `scripts/supabase/schema.sql`
- Create: `scripts/supabase/apply-schema.mjs`
- Create: `scripts/airtable/sync-to-supabase.mjs`
- Modify: `package.json`
- Modify: `.env.local` (add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)

**Step 1: Define Supabase tables**

Create `scripts/supabase/schema.sql` with tables:
- `services` (slug unique, name, category, summaries, includes, requests, meta, geo, active, priority, updated_at)
- `faqs` (service_slug fk, question, answer, priority, active)
- `testimonials`
- `gallery`
- `blog_posts`
- `site_settings`

**Step 2: Apply schema**

Use Supabase REST or MCP to apply SQL. If using REST:
- POST SQL to Supabase REST endpoint with service role key.

**Step 3: Build sync script**

- Read Airtable records from each table.
- Normalize into Supabase shapes.
- Upsert by `slug` or `key`.
- Ensure `active` gating and `status = Published` for blog.

**Step 4: Add npm scripts**

- `"supabase:apply": "node scripts/supabase/apply-schema.mjs"`
- `"airtable:sync": "node scripts/airtable/sync-to-supabase.mjs"`

**Step 5: Run sync**

Run: `npm run airtable:sync`
Expected: Upsert counts per table.

---

### Task 4: Site Wiring (Supabase-first)

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/content.ts`
- Modify: `src/app/services/page.tsx`
- Modify: `src/app/services/[slug]/page.tsx`
- Modify: `src/lib/constants.ts` (optional fallback use)

**Step 1: Supabase client**

Server-only client using service role for read:
- `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`

**Step 2: Content accessors**

Add functions:
- `getServices()`
- `getServiceBySlug(slug)`
- `getFAQsByService(slug)`
- `getSiteSettings()`

Fallback to constants if Supabase returns empty.

**Step 3: Update pages to use content accessors**

- `ServicesPage` uses `getServices()`.
- `ServiceDetailPage` uses `getServiceBySlug()` + `getFAQsByService()`.

**Step 4: Verify rendering**

Run: `npm run dev`
Check `/services` and `/services/[slug]`.

---

### Task 5: Documentation + Hand-off

**Files:**
- Modify: `README.md`
- Modify: `DECISIONS.md`

**Step 1: Update README**

Add sync commands and env requirements.

**Step 2: Update DECISIONS**

Record Airtable → Supabase → Site data flow.

---

**Execution handoff**

Plan complete and saved to `docs/plans/2026-02-02-airtable-supabase-sync.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
