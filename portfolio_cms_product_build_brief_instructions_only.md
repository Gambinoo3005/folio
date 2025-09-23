# Portfolio CMS — Product & Build Brief (Instructions Only)

This brief captures **what** the CMS is and **how** it should behave so Cursor can implement it without ambiguity—no code, just guidance. It assumes you already have a **marketing site** where users sign in and then access the CMS.

---

## 1) Purpose & Audience
- Deliver a **content‑only CMS** for **bespoke portfolio websites** (writers, photographers, developers/designers, artists, florists, etc.).
- Clients can **edit words and media** without touching layout or components.
- Promise: **“Custom portfolios, zero builder.”** You build the site; they update content safely.

---

## 2) Scope (V1) and Non‑Goals
**In scope (V1)**
- Admin area with dashboard, page/collection editors, media library, SEO panel.
- Draft → publish → (optional) schedule.
- Live preview while editing.
- Simple version history (keep last few versions) and restore.
- Public read endpoints for the live site (publish only) and a secure preview mode (drafts).
- Content export (JSON/CSV) for portability.

**Out of scope (V1)**
- Page builders or drag‑and‑drop layout.
- Complex workflows/approvals, multi‑locale, or plugin marketplace.
- Arbitrary CSS editing by clients (design is fixed).

---

## 3) How the CMS Is Organized (Information Architecture)
- **Pages (Singletons)**: One record per page that maps directly to a route (e.g., Home, About, Contact). These appear as **categories** in the CMS sidebar. Fields mirror the design.
- **Collections**: Repeatable items the site lists (e.g., Projects, Blog Posts, Galleries, Testimonials, Press). Each item has its own editor.
- **Globals**: Site‑wide elements (Navigation links, Footer content, Social handles, SEO defaults, Contact info).

**Default set for portfolios**
- Pages: Home, About, Contact.
- Collections: Projects (for dev/design), Posts (for writers), Galleries (for photo/art), Testimonials, Press.
- Globals: Navigation, Footer, Socials, SEO Defaults.

---

## 4) Editing Experience (Non‑technical Friendly)
- **Sign‑in flow** directs users from the marketing site into the CMS; remember their tenant/site context after login.
- **Dashboard** with large, plain‑language actions: “Update About”, “Add a Project”, “Change Home hero”, “Edit Contact details”. Show recent edits and a small health checklist.
- **Left rail** lists Pages, Collections, and Globals. Clicking a Page reveals only the fields that page allows.
- **Editor layout** per item uses clear sections:
  1) Title & URL
  2) Hero (image + alt + optional caption)
  3) Content (constrained rich text and approved media/embeds)
  4) Media (gallery or attachments as needed)
  5) SEO & Metadata (meta title/description, social image, canonical, noindex)
  6) Settings (publish date/time, tags/categories, featured toggle, author where relevant)
- **Live Preview** toggle shows the page as it will look, updating as they edit.
- **Autosave** drafts with clear “Saved a few seconds ago” feedback and lightweight undo.
- **Publish** is a single primary action. Scheduling is optional and clearly labeled.
- **In‑context edit**: when logged in, the public site shows a subtle “Edit this page” link that deep‑links to the correct editor screen.

---

## 5) Guardrails (Protect the Design)
- Only editable primitives: text, images, lists, references to other content.
- Fixed components/sections; clients can reorder lists (e.g., featured projects) but cannot alter structure.
- Field‑level hints: recommended image dimensions, title/description length ranges.
- Validation: required fields, URL and email format checks, limits for tags/categories.
- Accessibility nudges: require alt text; warn on overly wordy titles; encourage headings hierarchy.

---

## 6) Content Details by Persona (Field‑level intent, not schemas)
- **Writer (Posts)**: Title, subtitle, hero image, body content with headings/links/quotes, categories/tags, reading time (computed), SEO fields.
- **Photographer/Artist (Galleries)**: Title, short description, image list with reorder, optional proofing note (V2), SEO fields.
- **Developer/Designer (Projects)**: Title, summary, role, date, hero image, body content (problem/approach/results narrative), stack tags, external links (GitHub, live), gallery, SEO fields.

---

## 7) Publishing, Scheduling, Versions
- **Statuses**: Draft, Scheduled, Published, Archived.
- **Publish** copies the current draft into the published version and updates the live site.
- **Scheduling** moves an item to Published automatically at the scheduled time.
- **Version history** keeps a small rolling set; allow one‑click restore.
- **Redirects**: If a slug changes, prompt to add a redirect from old to new.

---

## 8) Media Management
- Central **Media Library** with drag‑and‑drop uploads, thumbnails, file size/type info, and basic image metadata.
- **Alt text is required**; provide a suggestion helper (non‑AI in V1 is fine: use filename and context prompts).
- Show recommended dimensions and warn on very large images; allow a focal point for hero usage.
- Reuse assets across entries; allow simple search and filtering.

---

## 9) SEO & Analytics
- Per‑entry **SEO panel**: meta title (falls back to Title), meta description with counter guidance, social (Open Graph/Twitter) image picker, canonical URL, noindex toggle.
- **SEO defaults** at Globals: default title/description/social image used when an entry omits them.
- **Sitemap and robots** are maintained automatically based on published entries.
- Optional lightweight analytics panel in the CMS that surfaces top pages and simple trends (privacy‑friendly).

---

## 10) Roles & Permissions
- **Owner**: billing and all permissions.
- **Admin**: manage content types, users, redirects, webhooks, and content.
- **Editor**: create, edit, and publish content; manage media and redirects.
- **Contributor**: create/edit drafts; cannot publish.
- **Viewer**: read‑only access to admin for stakeholders.

Enforce that users only see and act within their own tenant/site.

---

## 11) Reflection on the Live Website (Freshness)
- The live site should update **within seconds** of Publish.
- Mechanism: after Publish, the CMS sends a **cache refresh signal** (e.g., by tag or by path) so only the relevant pages update quickly at the edge/CDN.
- Preview mode always shows draft content without affecting the live cache.

---

## 12) Onboarding & Help
- **First‑run tour**: short, skippable, covers “Find a page → edit → preview → publish”.
- **Empty states** provide an example or a “Duplicate this example” action.
- **Inline tips** explain field expectations (e.g., “Keep meta descriptions between 50–160 characters”).
- **Help bubble** routes to documentation or a support form; Studio tier can expose a “Book your monthly call” link.

---

## 13) Integration with the Existing Marketing Site
- **Unified sign‑in**: users authenticate on the marketing site and are routed into the CMS with the right tenant/site context.
- **Global navigation**: marketing site header shows a **“Sign In”** / **“Go to CMS”** entry for authenticated users.
- **Account area**: marketing site hosts billing/subscription pages; CMS shows plan info and a link back to manage billing.
- **Single brand experience**: CMS inherits typography, color system, and basic components so it feels like part of the product family, not a different app.

---

## 14) Subscription Tiers (What to Gate)
- **Care (Base)**: CMS access, hosting, backups, monitoring, email support (48–72h), limited seats, media storage cap, basic analytics.
- **Care+**: adds a small number of monthly content micro‑requests, faster support, scheduled publishing, more seats, basic A/B on hero copy (optional), advanced analytics.
- **Studio**: includes a monthly strategy call, priority response, quarterly mini‑refresh, theme token adjustments (colors/typography) via a guarded Brand screen, higher limits, more versions retained.

Keep the model simple: gate **seats**, **media storage**, **versions retained**, **scheduled entries per month**, **webhooks**, and **analytics depth**.

---

## 15) Accessibility & Comfort
- Keyboard‑friendly admin, high‑contrast defaults, large touch targets.
- Clear validation messages (“This link doesn’t look valid—use https://…”).
- Require alt text and encourage descriptive headings.

---

## 16) Delivery Plan (Phased, No Technical Detail)
**Phase 1 — Foundation**
- Set up tenants/sites/users and roles.
- Implement Pages/Collections/Globals with editor screens.
- Draft storage, autosave, live preview.

**Phase 2 — Publish & Live Site**
- Publish flow and version history.
- Public read endpoints (published only) and secure preview.
- Cache refresh on publish so pages update quickly.

**Phase 3 — Polish & Operations**
- SEO panel with counters and defaults.
- Media library quality‑of‑life features and focal point.
- Redirects management, scheduling, basic analytics, content export.

---

## 17) Acceptance Criteria (What “V1 is Done” Means)
- A non‑technical user can log in from the marketing site, open **Home**, change hero text and image, preview changes instantly, publish, and see the live site update shortly after.
- They can add a **Project** (title, summary, hero, body, tags), publish it, and see it appear on the projects listing and detail page with correct SEO meta.
- Admin can restore one of the recent versions, set up a redirect after a slug change, and schedule a post to go live at a later time.

---

## 18) Content Matrix (Starter)
Use this as the default configuration when onboarding new portfolio clients:
- **Home (Page)**: Hero title, hero subtitle, hero image, featured projects (select up to three), CTA label + link, SEO section.
- **About (Page)**: Portrait image, bio content, skills list, optional downloads (resume), SEO section.
- **Contact (Page)**: Contact text, email/phone fields, social links, SEO section.
- **Projects (Collection)**: Title, subtitle, summary, role, date, hero image, body content, gallery, tags, external links, featured toggle, SEO section.
- **Posts (Collection, optional)**: Title, subtitle, hero image, body content, categories/tags, SEO section.
- **Galleries (Collection, optional)**: Title, description, images, SEO section.
- **Globals**: Navigation links, Footer content, Social profiles, SEO defaults (title, description, social image).

---

## 19) Risks & Mitigations
- **Scope creep in CMS features** → Hold the line on content‑only; publish a V2 roadmap for advanced asks (i18n, approvals, proofing).
- **Support overhead** → Define “micro‑requests” clearly in paid tiers; anything larger becomes a mini‑SOW.
- **Inconsistent content quality** → Enforce validations, word‑count guidance, and example entries for duplication.

---

## 20) Success Metrics
- Time from client login to first successful edit & publish (target: under 10 minutes).
- Publish‑to‑live latency (target: seconds, not minutes).
- Monthly active editors per tenant and churn by tier.
- Support tickets per tenant per month (aim to reduce via guidance and checklists).

