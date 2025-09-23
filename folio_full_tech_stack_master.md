# Folio — Full Tech Stack (Master)

Authoritative inventory of every framework, service, SaaS, and tool used across **Marketing**, **CMS/API**, and **Client Sites** for Folio V1. Versions reflect the **V1 freeze** and may advance under release procedures.

---

## 1) Runtime & Hosting
- **Platform host:** Vercel (production, staging, preview for each app and each client site)
- **Node runtime:** Node.js 20 LTS (all serverless functions)
- **Static/CDN:** Vercel Edge Network (site assets) + Cloudflare CDN for images
- **Regions:** Align Vercel regions with Neon DB primary region (TBD at provisioning)

---

## 2) Apps & Frameworks
### 2.1 Marketing Site (folio.com)
- **Framework:** Next.js **14.2.16** (App Router)
- **React:** **18**
- **TypeScript:** **5**
- **Styling:** Tailwind CSS **4.1.9**
- **UI:** shadcn/ui (New York style), Radix UI primitives
- **Animation:** Framer Motion
- **Theming:** next-themes (dark/light)
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono, Inter, Manrope
- **Forms & Validation:** React Hook Form, Zod, @hookform/resolvers
- **Analytics:** Vercel Analytics
- **Build tools:** PostCSS, Autoprefixer
- **Linting/Formatting:** ESLint (builds ignore errors per config), Prettier

### 2.2 CMS & Public Content API (app.folio.com / api.folio.com)
- **Framework:** Next.js (App Router) — Node runtime
- **React / TS:** React 18, TypeScript 5
- **Editor:** Tiptap (constrained semantic subset)
- **Forms & Validation:** React Hook Form, Zod
- **Styling & UI:** Tailwind CSS, shadcn/ui, Radix UI, Lucide, Framer Motion
- **Auth & Orgs:** Clerk (organizations, magic links, session across subdomains)
- **Jobs & Schedules:** Inngest (scheduled publish, retries, post-publish tasks)
- **Public API:** REST (JSON) endpoints within CMS app, exposed via `api.folio.com`
- **Caching:** Tag-based revalidation on publish; short TTL fallback
- **Feature Flags:** Vercel Edge Config (platform) + per-tenant overrides in DB

### 2.3 Client Sites (one deployment per client)
- **Framework:** Next.js (App Router) — Node runtime
- **React / TS:** React 18, TypeScript 5
- **Styling & UI:** Tailwind CSS, shadcn/ui (as needed), shared design tokens
- **Icons:** Lucide React
- **Fonts:** Inherit platform font set (Geist/Inter/Manrope) unless bespoke
- **Content SDK:** Private `@folio/content` (REST client, preview helpers)
- **Sections Library:** Private `@folio/sections` (curated components)
- **SEO Utils:** Private `@folio/seo`

---

## 3) Data & Storage
- **Primary DB:** Neon (serverless Postgres) — branches: production, staging, preview
- **ORM:** Prisma (schema & migrations)
- **Storage (media originals):** Cloudflare R2 (S3-compatible)
- **Image Delivery & Transforms:** Cloudflare Images via `cdn.folio.com`
- **Caching layer (app-level limits & quotas):** Upstash Redis (rate limiting, counters)

---

## 4) Identity & Access
- **Authentication & Organizations:** Clerk (magic link/email, org membership, roles)
- **Session sharing:** cross-subdomain on `.folio.com`
- **Roles:** Owner, Admin, Editor, Contributor, Viewer; Support Admin (vendor)

---

## 5) Payments & Commercial
- **Billing & Subscriptions:** Stripe Billing
- **Tax:** Stripe Tax
- **Customer Portal:** Stripe Customer Portal (link from marketing account area)
- **Invoicing:** Stripe Invoices (one-time build/migration fees)

---

## 6) Email & Notifications
- **Auth emails:** Clerk (system/auth templates)
- **Transactional/product emails:** Resend (publish success/failure, schedules, usage alerts)
- **Sending domain:** `mail.folio.com` (SPF/DKIM/DMARC configured)

---

## 7) Observability & Reliability
- **Errors & Performance:** Sentry (frontends + server)
- **Platform Monitoring:** Vercel Monitoring
- **Structured Logs:** **Axiom** (tenant/user-hash/request metrics, job logs)
- **Status Page:** Instatus (public uptime/incidents)
- **Uptime/cron checks:** Instatus and/or Vercel monitors (lightweight)

---

## 8) Security & Compliance
- **WAF & Edge Protection:** Cloudflare (WAF, Bot Fight Mode)
- **Form anti-abuse:** Cloudflare Turnstile + honeypot + app-level rate limits
- **Rate limiting/quotas:** Upstash Redis (per-IP, per-user, per-tenant)
- **Content sanitization:** sanitize-html (strict whitelist for rich text)
- **Headers & TLS:** HSTS, strict CSP, HTTPS-only, modern security headers
- **Secret scanning:** GitHub Advanced Security (or org-level secret scanning)
- **Dependency updates:** Renovate (automated PRs)

---

## 9) Secrets & Config
- **Secrets Manager:** Doppler (source of truth)
- **Sync Targets:** Vercel projects (marketing, CMS/API, each client site)
- **Per-client envs:** minimal (SITE_ID, public API/CDN base URLs)

---

## 10) Feature Flags & Experiments
- **Platform flags:** Vercel Edge Config (instant global reads)
- **Per-tenant overrides:** Database (override wins)
- **Distribution:** percentage rollout by deterministic hash of tenant ID

---

## 11) Analytics
- **Marketing:** Vercel Analytics
- **Client Sites:** Plausible (privacy-first, no cookies) — default
- **Optional (per-tenant, Studio):** GA4/GTM or PostHog (consent-gated)
- **CMS internal:** lightweight publish/activity metrics surfaced in dashboard

---

## 12) Domains & DNS
- **Marketing/CMS/API/Help/CDN:**
  - Marketing: `folio.com`
  - CMS: `app.folio.com`
  - API alias: `api.folio.com` (points to CMS app)
  - Help: `help.folio.com`
  - CDN: `cdn.folio.com`
- **Client custom domains:** Client-controlled DNS; Vercel-managed TLS; canonical `www`; apex → www redirect
- **Staging:** `{tenant}.preview.folio.com`

---

## 13) Submissions (Forms)
- **Endpoint:** `api.folio.com/submissions` (CORS)
- **Spam controls:** Cloudflare Turnstile, honeypot, rate limits, blocklists
- **Notifications:** Resend (email), optional Slack webhooks
- **Storage:** Central Submissions table (tenant-scoped) with export

---

## 14) Background Processing
- **Workflow engine:** Inngest (scheduled publish, retries, sitemap/feeds regen, LQIP/blurhash generation, notifications)
- **Queues & DLQ visibility:** Inngest dashboard + Axiom logs

---

## 15) Developer Experience
- **Monorepo tooling:** Turborepo (build orchestration) + pnpm
- **Private packages:** `@folio/*` published to **GitHub Packages (npm)**
- **Versioning & release:** Changesets (semver, changelogs)
- **Dependency PRs:** Renovate (opens bumps in client repos)
- **CI/CD:** GitHub Actions (publish packages, tests, lint); Vercel (deploy)
- **Design without auth (dev):** Auto-login Dev User (Clerk) on localhost/whitelisted staging

---

## 16) QA, Testing & Accessibility
- **E2E testing:** Playwright (editor flows, publish, domains, submissions)
- **Unit testing:** Vitest (handlers, utilities)
- **Performance checks:** Lighthouse CI (budgets; perf ≥ 90, a11y ≥ 95)
- **Accessibility testing:** axe-core/Storybook a11y checks for critical components

---

## 17) Documentation & Support
- **Help Center:** Next.js app at `help.folio.com` (static docs; searchable)
- **Scheduling for demos/calls:** Cal.com (embedded on marketing site)
- **Support inbox:** support@ (Google Workspace) routed to team
- **Internal issue tracking:** Linear (engineering/support triage)

---

## 18) Legal & Policy
- **Policies site:** Terms of Service, Privacy Policy, DPA (static pages under marketing)
- **Data export:** In-app export (content, media, redirects, submissions, SEO)
- **Retention:** 60-day backup retention post-deactivation; logs with masked PII ~90 days

---

## 19) Optional/Deferred (V2 candidates)
- **Search service:** Typesense or Meilisearch (if Postgres FTS becomes limiting)
- **A/B testing:** GrowthBook (feature experiments) — if needed beyond flags
- **Docs SaaS alternative:** Mintlify (if Help Center migrates off custom)
- **Enterprise auth:** SAML via Clerk (for larger orgs)
- **Proofing/Watermarking (photographers):** third-party or custom plugin

---

## 20) Naming & Packaging (internal)
- **Packages:** `@folio/site-core`, `@folio/sections`, `@folio/content`, `@folio/seo`
- **Apps:** `apps/marketing`, `apps/cms`, per-client repos (`client-<name>`)

---

### Notes
- All third-party vendors must be onboarded in the secrets manager with scoped API keys.
- Any substitution (e.g., Axiom ↔ Better Stack) must be recorded in the Decision Register and mirrored here before rollout.
- Versions are pinned at V1 GA; upgrades follow Changesets and Renovate workflow.
