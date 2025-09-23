# Local Development Guide — Folio

A short, repeatable playbook for running Folio locally on Windows (works on macOS/Linux too). Keep this near the repo root.

---

## 0) Prereqs
- **Node 20 LTS** (system-wide)
- **pnpm** (via Corepack)
- **Git**
- **Vercel CLI** (optional locally; required to link projects)
- **Doppler CLI** (secrets source of truth)

> Tip (Windows): enable long paths and avoid OneDrive sync for your dev folder.

---

## 1) Repo layout (monorepo)
```
apps/
  marketing/   # folio.com
  cms/         # app.folio.com (and api.folio.com alias)
packages/
  site-core/
  sections/
  content/
  seo/
```

---

## 2) Environment variables (\*.env.local default workflow)
**Source of truth:** Doppler project `folio-platform` with configs `dev`, `staging`, `prod`.

**Vercel mapping limit:** We mapped 5 integrations: all **CMS** envs (Dev/Preview/Prod) and **Marketing** (Preview/Prod). **Marketing/Development** is *not* mapped to keep within the limit.

### Default: generate `.env.local` files (no Doppler command per run)
Regenerate whenever secrets change in Doppler.

From repo root (PowerShell):
```powershell
# Marketing
doppler secrets download --project folio-platform --config dev --no-file --format=env > apps/marketing/.env.local

# CMS
doppler secrets download --project folio-platform --config dev --no-file --format=env > apps/cms/.env.local
```
Then, inside each app, just run `pnpm dev`.

> `.env*` files are git-ignored and should never be committed.

### Optional: run through Doppler (when you want zero files)
From each app folder:
```powershell
doppler run --project folio-platform --config dev -- pnpm dev
```
Use this only if you prefer not to create `.env.local`.

---

## 3) Quick-start commands (Windows)
**Day-to-day using `.env.local`:**
```powershell
# In one terminal
cd apps/marketing
pnpm dev

# In a second terminal
cd ../cms
pnpm dev
```

**When secrets change:** re-run the two `doppler secrets download` commands from Section 2 to refresh `.env.local`. Then restart the dev servers.
 (Windows PowerShell helpers)
Add to your PowerShell profile for short aliases:
```powershell
# Open your profile file
notepad $PROFILE

# Add these helpers, save, reopen terminal
function devm { Set-Location apps/marketing; doppler run --project folio-platform --config dev -- pnpm dev }
function devc { Set-Location apps/cms; doppler run --project folio-platform --config dev -- pnpm dev }
```
Usage:
- `devm` → run Marketing in dev
- `devc` → run CMS in dev

---

## 4) Ports & URLs (dev defaults)
- Marketing: **http://localhost:3000**
- CMS app & API alias: **http://localhost:3001**

> The API base in dev can be `http://localhost:3001` while production will be `https://api.folio.com` (alias to CMS).

---

## 5) Auth during development
- **Auto-login Dev User** is enabled on localhost/whitelisted staging hosts so you can view the CMS without manual sign-in.
- A visual **DEV SESSION** ribbon should be visible; destructive actions (publish/delete/webhooks/emails) may be disabled in this mode.

---

## 6) Vercel projects & linking
Run from each app folder once:
```powershell
pnpm dlx vercel@latest login
pnpm dlx vercel@latest link   # create or select the right project
```
Expected mapping after linking:
- `apps/marketing` → Vercel project **folio-marketing**
- `apps/cms` → Vercel project **folio-cms**

Domains will be added later in Vercel (folio.com, app.folio.com, api.folio.com alias).

---

## 7) Doppler ↔ Vercel sync (deployed envs)
Configured connections (5 total):
- `folio-cms`: Development, Preview, Production → mapped to Doppler `dev`, `staging`, `prod`.
- `folio-marketing`: Preview, Production → mapped to Doppler `staging`, `prod`.

Local **Marketing/Development** uses Doppler directly (Option A) or `.env.local` (Option B).

After editing secrets in Doppler, click **Sync Now** on the connection and redeploy in Vercel to apply.

---

## 8) Common scripts (expected in each app’s package.json)
- `dev` — start app in dev mode
- `dev:doppler` — same as `dev` but launched via Doppler
- `build` — production build
- `start` — run the built app locally
- `lint`, `typecheck`, `test` — quality gates

> AI coders will wire these scripts; this README defines expectations.

---

## 9) Troubleshooting (Windows)
- **EPERM / permissions** when enabling Corepack: open PowerShell **as Administrator**, re-run `corepack enable`.
- **pnpm not found** after enabling: close/reopen terminal; run `corepack prepare pnpm@latest --activate`.
- **Long path errors**: enable long paths and `git config --global core.longpaths true`.
- **OneDrive file locks**: exclude your dev folder from OneDrive sync or pause syncing during dev.
- **Env not picked up**: if using `.env.local`, re-run the Doppler download after secrets change; for Doppler launcher, make sure you ran through `doppler run …`.

---

## 10) What to commit
- All source code under `apps/*` and `packages/*`
- Tooling config (lint, tsconfig, turbo, etc.)
- **Do not commit:** `.env*`, `.vercel/`, build artifacts, `node_modules/`

---

## 11) Day-1 checklist
- `pnpm -v` shows a recent 10.x
- `doppler --version` works
- `vercel --version` works (or `pnpm dlx vercel --version`)
- `devm` launches Marketing on :3000
- `devc` launches CMS on :3001

---

## 12) When secrets change
- **Default (`.env.local`) workflow:** re-run the two download commands from Section 2 to refresh files, then restart dev servers.
- **If using Doppler launcher (optional):** nothing to do; the next `doppler run …` picks up new values.

---

Happy building! Keep this file updated when ports, scripts, or env names change.