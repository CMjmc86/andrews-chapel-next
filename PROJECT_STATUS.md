# Project Status

Last updated: July 2026. Update this file whenever significant work is completed or new
issues are found — it's the source of truth for "where did we leave off."

---

## ✅ Fully Built & Working

### Public Site
- Home, About Us (Our Story / What We Believe / Leadership / AME Zion Heritage),
  Ministries, Events, Bulletin, Get Connected (Visitor Card, Join, Message Pastor,
  Connect Groups), Prayer Wall, Give + Building Fund
- Media section (Sermons, Live Stream, Gallery, Downloads, Worship Music)
- Hero carousel — auto-rotating, manual arrows/dots, pause-on-hover. Currently showing
  real photos: church building, Pastor Kathy, two community outreach (gift bag) events,
  plus one remaining gradient placeholder slide ("Youth Ministry" — needs a real photo)
- Privacy Policy page, linked in footer

### Member Portal
- `/portal` — sign up / sign in, with inline field-level validation (no native browser
  popups), email format + password strength + phone format checks
- Email confirmation → admin approval flow (auto-creates `members` row via DB trigger)
- `/portal/account` — profile editing, granular directory sharing (separate toggles for
  directory opt-in, share email, share phone — enforced at the DATABASE level via the
  `public_directory` view, not just hidden in the UI)
- `/portal/directory` — shows only opted-in members, respects per-field sharing choices
- `/admin/members` — staff approval screen (Pending / Approved / Rejected tabs)
- `/admin/directory` — full staff view of all approved members regardless of opt-in

### Security
- Full RLS lockdown across all 6 submission tables (SELECT + UPDATE) — previously any
  signed-in user (including pending members) could read/write staff-only data via direct
  API calls, bypassing the dashboard UI entirely. Fixed by replacing
  `auth.role() = 'authenticated'` policies with proper `admin_roles` role checks.
- `checkAuth()` fix in `admin/page.tsx` — previously any signed-in user could reach the
  admin dashboard even with zero staff role; now redirects + signs out if no role found
- `middleware.ts` — server-side route protection for `/admin/*` and `/portal/account`,
  `/portal/directory`. Uses `@supabase/ssr` cookie-based sessions.
- Consolidated ~10 separate `createClient()` instances into one shared client
  (`lib/supabase.ts`) — was causing "Multiple GoTrueClient instances" warnings and
  session-sync bugs between pages
- Forgot password flow (`/auth` → `/auth/reset-password`)

### Admin Dashboard
- Submissions management (Prayer Requests, Praise Reports, Visitor Cards, Join
  Applications, Pastor Messages, Connect Groups) — approve, soft-delete, restore
- Task assignment to leaders, with email notifications
- Bulletins, Events, Sermons management
- Roles management (`/admin/roles`) — assign/change/remove staff roles
- Member approvals (`/admin/members`) and directory (`/admin/directory`)

### Form Validation
- All 6 forms (Visitor Card, Join, Message Pastor, Connect Groups, Portal, Auth) have:
  - Inline, per-field error messages (not a top summary box, not native browser popups)
  - Email format validation, phone auto-formatting + 10-digit completeness check
  - Required-field checks matching each form's actual business rules

### Branding
- AME Zion triangle logo (extracted from official district artwork) in header + footer
- Gold "Back to Home" navigation links across `/auth`, `/admin`, `/portal/*`

---

## 🟡 In Progress / Needs a Decision

- **Sentry** — trial ending, recommended downgrading to the free Developer tier
  (5,000 events/month, plenty for this site's traffic). Needs to be done manually in
  Sentry's dashboard — not something fixable in code.
- **Favicon** — generated from the AME Zion triangle logo, but NOT yet applied. Held off
  because the final logo hasn't been confirmed. Files are ready (`favicon.ico`,
  `apple-touch-icon.png`) whenever the logo is finalized.
- **Hero carousel photos** — church, pastor, and 2 outreach photos are in; still need a
  Youth Ministry photo (or another category) for the last slide.
- **Code quality refactor** (in progress as of this session) — see "Known Technical Debt"
  below for the full list. Starting with this README + status doc, then database
  migrations, then design system extraction, then de-duplication, then automated tests.

---

## 🔴 Not Started / Pre-Launch Blockers

1. **Domain registration** — `andrewschapelame.org` via Cloudflare
2. **Resend domain verification** — currently sending from `onboarding@resend.dev`, which
   can ONLY deliver to the email address the Resend account itself is registered under.
   Real member signups will NOT receive confirmation emails until this is fixed. This is
   the single most important remaining blocker for real member signups to work at all.
3. **Environment variables on Vercel** — need to verify production env vars match local
   `.env.local`, since Vercel doesn't read `.env.local` automatically
4. **Test account cleanup** — `sqltestmember@example.com` and any other test accounts need
   to be removed or clearly flagged before real launch, so they don't appear in the member
   directory or admin views
5. **Real staff accounts** — Pastor Kathy and actual admins need real `/auth` accounts with
   correct roles assigned (currently only the developer's own test/personal accounts exist)
6. **404 page** — not yet checked whether this shows something reasonable or Next.js's raw
   default
7. **Community Outreach & Missionary Fund pages** — currently placeholders that just route
   to `/give`

---

## 🟢 Backlog (Not Blocking Launch)

**Admin Dashboard**
- Clickable mailto links on submitter emails
- Confirm "Roles" nav link only shows for `super_admin`

**Public Site Features**
- Event RSVP system with capacity limits
- Photo gallery management (admin-uploadable)
- Live stream integration (Facebook/YouTube embed)

**Communications**
- Email newsletter (weekly bulletin delivery)
- Push notifications for new bulletins/events

**Analytics & Growth**
- Giving analytics dashboard
- SEO (meta tags, sitemap, Google Search Console)
- Google My Business listing

**Security & Performance**
- Rate limiting on form submissions (per IP)
- Image optimization (WebP, lazy loading)
- Lighthouse performance audit
- Two-factor authentication (2FA) for staff logins

**Form Validation**
- Audit remaining forms not yet reviewed (Prayer Wall, Praise Reports, Give/Building Fund)
  for the same native-browser-popup issue already fixed elsewhere

**Testing**
- Mobile responsiveness pass across remaining pages (only Footer site-wide + About page
  tabs have been specifically tested/fixed so far)
- Full UAT with Pastor Kathy and staff
- End-to-end form testing (confirm submissions actually land in Supabase and show in admin,
  not just that validation works client-side)
- Real device testing (not just DevTools emulation)

---

## Known Technical Debt

Identified during a code-quality review. Not urgent, but worth addressing before handing
this project to another developer or scaling the team:

1. **No shared design system** — colors, gradients, and card styles are repeated inline
   across dozens of files instead of pulled from one theme source. Changing a brand color
   currently means find-and-replace across many files.
2. **No README / setup docs** — ✅ being fixed right now (this file + README.md)
3. **Database schema not version-controlled** — RLS policies and table structure exist only
   in the live Supabase dashboard, not as tracked migration files in the repo. No single
   source of truth for "what does the database actually look like."
4. **No automated tests** — all testing has been manual click-through. Regressions are only
   caught by someone manually re-testing.
5. **Minimal code comments explaining intent** — most files don't explain *why* something
   was built a certain way, only *what* it does.
6. **Duplication across the 4 public forms** — Visitor Card, Join, Message Pastor, and
   Connect Groups each have nearly identical `Field` component, `formatPhone` function, and
   validation logic copy-pasted rather than shared from `lib/`.

**Planned order to address:** README/docs (in progress) → database migrations → shared
design system → de-duplication → automated tests, tackled incrementally with testing
between each step to avoid regressions.

---

## Notable Past Bugs (for future reference)

A few bugs worth remembering if similar symptoms show up again:

- **"Multiple GoTrueClient instances" console warning** → caused by separate
  `createClient()` calls instead of the shared `lib/supabase.ts` client. Now fixed
  everywhere, but if a new page is added without importing the shared client, this will
  come back.
- **RLS silently returns empty results, no error** → when a query returns nothing
  unexpectedly, check RLS policies before assuming it's a frontend bug. Postgres does NOT
  throw an error when RLS blocks a row — it just omits it.
- **Signup success message not displaying** → caused by calling `switchMode()` right after
  `setSuccess()`, which itself resets `success` back to `""` as a side effect. Fixed by
  setting mode/form directly instead of through that shared function in the success path.
- **Resend "you can only send to your own email" error** → Resend's free/unverified tier
  can only deliver to the email the Resend account itself is registered under. Will be
  fully resolved once the custom domain is verified with Resend.
