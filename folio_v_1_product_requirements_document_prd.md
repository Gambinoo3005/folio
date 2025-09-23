# Folio V1 — Product Requirements Document (PRD)

This PRD converts the previously approved decisions into precise, build-ready instructions for AI coding agents. No source code is included; all requirements are described declaratively.


## 1) Product summary
**What Folio is:** A bespoke portfolio website service with an invite-only CMS. Folio builds the site; clients edit content safely (no page builder). Subscriptions are available only after a build is agreed (or for full-site migrations).

**Primary outcomes:**
- Clients can edit text and media without breaking design.
- Publishing is fast and reliable; changes appear on the live site within seconds.
- One deployment per client with consistent platform capabilities.

**Success criteria:**
- Time from first login to first successful publish under 10 minutes.
- Publish-to-live latency under 30 seconds (p95) after a successful publish.
- Core Web Vitals in the “Good” range for client sites.


## 2) Scope and non-goals (V1)
**In scope:**
- CMS admin with dashboard, pages (singletons), collections, globals, media library, constrained rich-text editor, SEO panel, version history, draft/preview/publish/schedule, redirects, submissions inbox, analytics panel, domains screen, read-only billing summary, feature flags (admin-only), export.
- Public Content API (REST) served from the CMS app and exposed via api.folio.com.
- One deployment per client site with custom domain mapping.
- Provisioning pipeline from “offer accepted” to staged site (preview) ready.

**Out of scope (V1):**
- Page builder, drag-and-drop layout, or arbitrary CSS editing.
- Multi-locale, complex approvals/workflows, plugin marketplace.
- Multi-site per tenant (one tenant = one site in V1).


## 3) Personas
- Client Owner (role: Owner): pays invoices, manages plan, can publish.
- Client Admin (role: Admin): manages users, content types, redirects; can publish.
- Client Editor (role: Editor): edits and publishes content; manages media.
- Client Contributor (role: Contributor): edits drafts only.
- Client Viewer (role: Viewer): read-only access to admin.
- Folio Support Admin: vendor-side support role with scoped access.


## 4) System architecture (high-level)
**Apps and services:**
- Marketing app at folio.com (Next.js) with Pricing and intake flows.
- CMS/API app at app.folio.com (Next.js) hosting admin UI and REST Content API. Domain alias api.folio.com points to same deployment for public reads.
- Client sites: one Vercel project per client (production and staging); each consumes Content API.
- Authentication and orgs: Clerk. Sessions are shared across subdomains.
- Database: Neon Postgres (serverless) with branches for production, staging, and ephemeral previews.
- Object storage and image delivery: Cloudflare R2 + Cloudflare Images via cdn.folio.com.
- Transactional email: Resend (product mail) and Clerk (auth emails).
- Jobs and schedules: Inngest.
- Observability: Sentry for errors and performance; Axiom or Better Stack for structured logs; Vercel Monitoring; public status page.
- Feature flags: Vercel Edge Config (platform flags) with per-tenant overrides in the database.
- Secrets management: Central secrets manager synced to Vercel (marketing, CMS/API, client sites).
- Analytics for client sites: Plausible by default; GA4 or other tools optional and consent-gated.

**Environments:** production, staging, and preview for platform apps and each client site. Staging uses anonymized or seeded data only.


## 5) Domains and deployments
- Marketing: folio.com (production), staging.folio.com (staging).
- CMS: app.folio.com (production), staging.app.folio.com (staging).
- API alias: api.folio.com → CMS deployment.
- Help/docs: help.folio.com.
- CDN: cdn.folio.com.
- Client sites: staging on tenant.preview.folio.com, production on the client’s custom domain (for example, www.client.com).


## 6) Tenancy and roles
- One tenant equals one portfolio site in V1.
- All rows in application data include a tenant identifier that maps one-to-one with Clerk Organization ID.
- Roles and permissions: Owner, Admin, Editor, Contributor, Viewer with the capabilities described in Personas.


## 7) Security and privacy
- Unified sign-in via Clerk with sessions valid across subdomains (folio.com and app.folio.com).
- Admin-only impersonation permitted on staging for QA; disabled on production.
- Design-time convenience: Auto-login Dev User enabled only on localhost and whitelisted staging hosts; all destructive actions are disabled in this mode.
- Content sanitization: strict HTML whitelist for rich-text; only allow listed embeds.
- Privacy: PII in submissions is stored with care; logs must mask PII fields.


## 8) CMS admin feature specifications
### 8.1 Dashboard
- Shows quick actions (Update About, Add Project, Change Home hero, Edit Contact details), recent edits, publish status, usage meters (storage, versions, scheduled posts), and a help link.

### 8.2 Navigation and information architecture
- Left rail categories: Pages, Collections, Globals, Media, Submissions, Domains, Analytics, Settings, Help.
- Pages (singletons) mirror site routes such as Home, About, Contact.
- Collections: Projects, Posts, Galleries, Testimonials, Press (configurable per tenant as needed).
- Globals: Navigation links, Footer content, Socials, SEO defaults.

### 8.3 Editor screen
- Layout: top bar (breadcrumb, status, autosave indicator, Preview, Publish), left rail sections, main form, right panel with checklist.
- Sections per item: Title and URL, Hero, Content, Media, SEO and Metadata, Settings.
- Rich-text policy: constrained, semantic subset (headings H2/H3, paragraph, bold, italic, links, lists, blockquote, inline code). Blocks: image, gallery, video embed (YouTube and Vimeo), callout.
- Guardrails: word-count hints for titles and meta description; required alt text for hero and gallery images; URL validation; date pickers; tags/categories limits.
- Live preview: split view toggled from the editor; preview always uses draft content and bypasses cache.
- Autosave: background saves with unobtrusive status messaging.

### 8.4 Version history and restore
- Keep a rolling set of versions by tier (see plan limits). Each version can be previewed and restored.

### 8.5 Publish and schedule
- Publish copies draft content to the published version and triggers cache revalidation.
- Schedule allows selecting a future date and time; a background job promotes content at the scheduled time.

### 8.6 Redirects
- Slug changes prompt a redirect suggestion from old to new path. Admins can manage 301 or 302 redirects in a dedicated screen.

### 8.7 Media library
- Central asset manager with drag-and-drop uploads, metadata (mime, size, width, height), alt text, focal point, and search filters.
- Balanced defaults for transforms: thumbnail (approximately 200 wide), card (approximately 800 wide), hero (approximately 1600 to 2000 wide). Automatic WebP or AVIF where supported.
- Upload rules: allowed types, maximum size 15 MB per image (Studio tier can increase). Required alt text on upload.

### 8.8 Submissions inbox
- List of form submissions with filters (date range, form key, spam verdict). CSV export. Ability to resend notification email.
- Spam indicators are visible; a manual “mark as spam/not spam” control exists.

### 8.9 Analytics panel
- Embedded Plausible summary with top pages and trends. For optional GA4 or PostHog, load only after consent.

### 8.10 Domains screen
- Flow for connecting a custom domain. Display required DNS records, current verification status, and HTTPS status. Provide a one-click verification recheck.

### 8.11 Billing summary
- Read-only view of current plan, usage, renewal date, and a link to manage billing on the marketing site account page.

### 8.12 Feature flags (admin only)
- Show platform flags and per-tenant overrides. Overrides take precedence.

### 8.13 Export
- One-click export produces a downloadable archive containing content, media, redirects, submissions, SEO defaults, and a README that explains structure.


## 9) Public Content API (REST)
Important: describe routes and parameters precisely; no code samples.

- Get singleton page content: method GET, path /content/{pageKey}. Returns the latest published content for that page. Supports cache tagging for page:{pageKey}.
- List collection items: method GET, path /collection/{type}. Query parameters include limit, offset, tag, featured. Returns published entries with basic fields needed by the sites.
- Get single collection entry: method GET, path /entry/{type}/{slug}. Returns the published entry.
- Preview endpoints (authenticated): method GET, path /preview/{pageKey} and /preview/{type}/{slug}. Returns draft content. Requires a valid preview session or a signed, expiring link.
- Revalidation webhook (private): method POST, path /revalidate. Accepts a list of tags and optional explicit paths to refresh.

**Caching and consistency rules:**
- Public GET responses are cacheable and tagged by page, collection, and entry. After publish or restore, the CMS triggers revalidation for affected tags and paths.
- Preview responses bypass cache and must never be indexed by search engines.


## 10) Background jobs and schedules
- Scheduled publish: at scheduled time, promote to published, set timestamps, increase version, send notifications, and trigger revalidation.
- Webhook retries: retry failed revalidation calls with exponential backoff and a maximum of five attempts; failures land in a dead-letter queue with alerts.
- Post-publish tasks: regenerate sitemap and feeds if applicable; send a publish success email.
- Media post-processing: create low-quality placeholders or blur hashes and store focal point metadata.


## 11) Submissions (contact forms)
- Client sites submit to api.folio.com/submissions (CORS configured). Required fields include tenant identifier, form key, and a generic dictionary of form fields.
- Server records IP address, user agent, spam verdict, and timestamp; stores payload in the submissions table.
- Spam controls: Cloudflare Turnstile challenge, hidden honeypot, per-IP rate limits, and a blocklist.
- Notifications: transactional email to the client’s configured address; optional Slack webhook; daily digest if volume exceeds a configurable threshold.


## 12) Rate limiting and quotas
- Content API: default 60 requests per minute per IP and 600 per minute per tenant. Cache hits do not count toward these quotas.
- Admin API: default 30 requests per minute per user, burst up to 60. Progressive backoff on failed authentication attempts. Lockout after repeated failures.
- Revalidate webhook: signed HMAC; two requests per minute per page key; queued if exceeded.
- Uploads: allowed mime types only; size limits as above; optional antivirus scan.
- Quotas by plan: see Plan limits section.
- Responses: standardized status for rate limit exceeded with a Retry-After header. Informational UI messaging in the CMS.


## 13) Billing and access control
- Pricing page is public with visible tiers; all calls to action are “Start a build” or “Talk to us.” No public checkout.
- Offers are created internally and shared through a signed, expiring link that includes build fee, recommended plan, and subscription start rule.
- For new builds: build fee invoiced immediately; subscription starts on go-live day (month one implicitly includes hypercare without special rules).
- For migrations: subscription begins immediately upon acceptance.
- Grace and delinquency: read-only CMS after a grace period; live site remains available for an additional period; final export before deactivation; backup retention window applies.


## 14) Provisioning flow (event-driven)
Triggered when an offer is accepted and required payments are completed.
- Create a Clerk Organization and invite the purchaser as Owner.
- Create tenant and site records in the database; seed default content types and initial example entries.
- Create Vercel projects for staging and production; set environment variables from the central secrets manager.
- Attach the staging domain at tenant.preview.folio.com and deploy.
- Provision a tenant-specific namespace in Cloudflare R2 for media.
- Initialize quotas and per-tenant feature flags.
- Send a welcome email with links to CMS, staging site, and help documentation.
- Mark the tenant provisioning state accordingly; implement retry and rollback rules.


## 15) Custom domains
- Domains screen guides clients to connect their custom domain using client-controlled DNS. Canonical host is www; apex redirects to www.
- Required records: CNAME for www to the Vercel alias; A record of apex to the Vercel IP as required; enforce HTTPS.
- Verification status is polled until secure. Provide alternative HTTP file verification if DNS is slow.


## 16) Observability and error handling
- Logging: per request, record a unique request identifier, tenant identifier, hashed user identifier, route name, HTTP status, duration, cache status, revalidation tags, and origin (admin or public API). Logs are queryable in the logging system.
- Alerts (examples): critical if server errors exceed one percent over five minutes, if auth webhooks fail, if the publish queue backlog exceeds five, or if a scheduled publish is missed by two minutes. Warning thresholds for latency and upload failure rates.
- User-facing messages: publish failures show a banner with a retry option and a correlation ID; revalidation failures keep last good cache and offer a retry; preview errors display the last saved draft.
- Public API failures: serve a cached response when available; otherwise display a friendly maintenance message on the site.


## 17) Feature flags
- Namespaces: cms.*, site.*, marketing.*. Each flag has a master enabled toggle.
- Resolution order: per-tenant override in the database, then platform flag in Edge Config, then default value.
- Percentage rollouts use a deterministic hash of tenant identifier. Admin UI shows the final evaluated state and recent override changes.


## 18) Secrets and configuration
- Central secrets manager is the source of truth. Sync to Vercel for each project.
- Platform secrets include Clerk, Neon, Cloudflare, Resend, Stripe, Inngest, Sentry, and Turnstile.
- Per-client site environment configuration is minimal: a stable site identifier and public base URLs for API and CDN.
- Policy: quarterly rotation, least privilege, no secrets in logs, development templates provided for local use only.


## 19) Media defaults and accessibility
- Alt text is required on image upload and verified prior to publish for key images.
- Focal point is required for hero images and stored with the asset record.
- Compression and formats: automatically serve modern formats where supported; quality tuned for balanced performance.
- Accessibility baseline: WCAG 2.2 AA for both admin and public sites. Keyboard access, focus states, and color contrast must meet guidelines.


## 20) Plan limits (initial)
- Care: 1 seat, 5 GB media, retain 5 versions per entry, 2 scheduled publishes per month, 1 webhook, 100 submissions per month.
- Care+: 2 seats, 15 GB media, retain 20 versions, 10 scheduled publishes, 3 webhooks, 500 submissions per month.
- Studio: 4 seats, 50 GB media, retain 100 versions, 40 scheduled publishes, 10 webhooks, 2000 submissions per month. Studio includes a monthly strategy call.


## 21) Performance and SLOs
- Publish to live (revalidation and CDN propagation): 30 seconds or less at p95.
- Server response time targets for public Content API: p95 under 300 milliseconds after warm cache.
- Client site targets: Lighthouse performance score at least 90 and accessibility at least 95 on representative pages.


## 22) Legal and policy
- Terms of Service and Privacy Policy links appear in both marketing and CMS. Data Processing Addendum is available upon request.
- Data export is always available in the CMS. On account deletion or tenant wipe, purge database rows, media, and caches subject to backup retention.
- Backups are retained for 60 days after deactivation; operational logs containing masked PII may be retained for 90 days.


## 23) Acceptance criteria (V1 done)
- A non-technical user can log in from folio.com, open the Home page in the CMS, change hero title and image, preview changes, publish, and see the live site update within seconds.
- The user can add a Project with hero image and body, set a meta description, publish, and see it on the projects list and detail page with correct SEO metadata.
- Admin can restore a prior version, schedule a post and observe it publish at the configured time, and create a redirect after a slug change.
- Custom domain connection workflow reaches secure status with correct DNS and HTTPS.
- Submissions appear in the CMS inbox with spam verdicts and notifications are sent.
- Export generates a downloadable archive with all specified contents.
- Observability and alerts function as specified, with a public status page reachable from the CMS footer.


## 24) QA plan (high-level)
- Environment sanity: staging and production apps use correct branches and environment variables; staging has anonymized data only.
- Authentication: sign-in flows, organization membership, role-based UI states, auto-login Dev User on localhost only.
- Editor flows: autosave, live preview, publish, schedule, version restore, redirects.
- Media: upload limits, alt text requirement, focal point persistence, transform quality checks.
- Content API: cache tags applied as specified; revalidation after publish; preview endpoints bypass cache and include the preview banner.
- Submissions: Turnstile, honeypot, and rate limits enforced; spam classification recorded; notifications delivered.
- Domains: DNS records detection, verification, certificate issuance, apex to www redirect, HTTPS-only, HSTS enabled.
- Billing: offer acceptance, build invoice handling, subscription start at go-live, grace and delinquency states.
- Observability: forced error results in Sentry event; structured logs contain required fields; alerts trigger according to thresholds.
- Accessibility: keyboard traversal, focus visibility, contrast compliance, ARIA labeling on complex components.


## 25) Rollout plan
- Internal alpha on staging with two pilot tenants (one new build, one migration).
- Soft launch with five clients; monitor publish latency, error rates, and support tickets.
- General availability upon meeting SLOs for four consecutive weeks.


## 26) Risks and mitigations
- Scope creep in CMS: hold the line on content-only editing; track V2 asks in a public roadmap.
- Support overload: define micro-requests per tier; funnel larger changes into additional statements of work.
- DNS setup delays: provide an alternative verification path and guided docs; show status clearly.
- Image bloat: enforce upload limits; provide dimension hints and automatic compression.
- Revalidation failures: use retries, short TTL fallback, and visible retry controls.


## 27) Open items for V2 (not required for V1)
- Internationalization and multi-locale content.
- Approval workflows and content reviews.
- Photographer proofing and watermark options.
- Theme token editing (Studio tier) beyond SEO and content.
- GraphQL API and webhooks marketplace if integrations demand it.


## 28) Operational checklists
**Security hardening:** strict content security policy, HTTPS with HSTS, secret scanning in repositories, dependency updates via bot, least-privilege tokens, PII masking in logs.

**Backups and disaster recovery:** nightly database backups, weekly media manifests, quarterly restore tests.

**Documentation:** help site with at least ten short articles, each editor screen links to its corresponding guide. Include setup guides for DNS and domain verification.


---

This PRD is authoritative for Folio V1. Any change requests should be appended here with a date-stamped “Change log” section and a clear impact assessment on scope, timelines, and budget.

