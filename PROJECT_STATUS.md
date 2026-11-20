# Project Status

Last updated: November 19, 2026. Update this file whenever significant work is completed or new
issues are found — it's the source of truth for "where did we leave off."

---

## 🚨 Security Status (as of November 2026)

### ✅ Fixed and verified live
- **`/api/admin/add-role` privilege escalation** (anyone could make themselves super admin).
  Route now requires a signed-in super admin, validates the role, paginates user lookup.
  Verified: logged out → 401, signed-in non-staff → 403. Checked `admin_roles`: only the
  owner's row exists, so the hole was not used.
- **RLS audit** (`supabase/schema/04_security_hardening.sql`): bulletins/events/sermons no
  longer writable by any signed-in user; members can't self-approve (trigger); raw `members`
  table no longer readable (directory goes through the view, which now also requires an
  approved viewer); staff list no longer readable by every account; roles Remove button works
  (new DELETE policy); prayer/praise can't be inserted pre-approved; deleted prayer/praise
  items no longer show publicly. Verified with attack simulations and real form submissions.
- **`/api/notify` rewritten** (November 2026): public form types only email the staff address
  (`STAFF_NOTIFY_EMAIL` env var, set in Vercel + `.env.local`); task emails require a signed-in
  staff member and a recipient who is in `admin_roles`; all values HTML-escaped; thank-you
  emails to submitters are OFF (`ENABLE_SUBMITTER_EMAILS=true` to enable). Verified: a praise
  report notification arrived. **Not yet tested:** task assigned / completed emails (needs a
  second staff account).

### 🟠 Still open
1. **Turnstile is not enforced on the server.** Forms verify the token in the browser, then
   insert straight into Supabase with the public anon key. Anyone can skip the widget and call
   Supabase directly. Real fix: move each public form's save into a server route that verifies
   the Turnstile token and then inserts. Until then, spam is possible — rate limiting matters.
2. **Rate limiting** on submissions and on `/api/notify` (Resend quota abuse).
3. **Turn on submitter thank-you emails** only after the Resend domain is verified AND (1)/(2).
4. Minor: `is_super_admin()` has no pinned `search_path`; its definition isn't in the docs.
5. Task emails untested (see above).

## 🔴 Launch Blockers

1. **Supabase plan decision.** The project is on the Free plan, which pauses projects after
   a week of inactivity. It paused in early September 2026 and has since been resumed. A
   paused database takes down every form, login, the admin dashboard, and the member portal.
   Pro ($25/month per organization, with compute credit covering one small project) is never
   paused for inactivity, and Supabase's pricing page lists automatic backups on Pro but not
   on Free. Decide: upgrade to Pro, or accept the risk. Confirm current pricing in the
   Supabase dashboard before deciding.
2. **Register `andrewschapelame.org`** via Cloudflare.
3. **Verify the domain with Resend.** Email currently sends from `onboarding@resend.dev`,
   which can only deliver to the address the Resend account is registered under. Real
   members will not receive confirmation emails until this is fixed.
4. **Domain follow-through** (these break quietly when the domain changes):
   - Supabase Auth: set the Site URL and add redirect URLs for the new domain, including
     `/auth/reset-password` and `/portal`
   - Cloudflare Turnstile: add the new hostname to the widget's allowed domains
   - Supabase SMTP: change the sender to `noreply@andrewschapelame.org`
   - Make sure `contact@andrewschapelame.org` actually receives mail (printed in the footer
     and privacy policy)
   - Attach the domain in Vercel
5. **Environment variables on Vercel.** Vercel doesn't read `.env.local`. Confirm each is set
   for Production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
   `RESEND_API_KEY`, `STAFF_NOTIFY_EMAIL` (new). Sentry variable names still unconfirmed.
6. **Sentry.** The trial was ending in July. Check its current state and downgrade to the
   free Developer tier if needed (done in Sentry's dashboard, not in code).
7. **Real staff accounts.** Pastor Kathy and the other admins need real `/auth` accounts with
   the correct roles (currently only developer/test accounts exist).
8. **Remove test data** (`sqltestmember@example.com` and any test submissions) so it doesn't
   appear in the directory or admin views. Do this right before launch, after UAT.
9. **Community Outreach & Missionary Fund pages.** Placeholders that just route to `/give`.
10. **404 page.** Not yet checked whether it shows something reasonable.
11. **Privacy policy review.** Written as a plain-language starting point, not reviewed by a
    lawyer. It names specific services (Supabase, Resend, Turnstile, Vercel), so update it if
    those change.

---

## 🟡 Before Launch — Testing & Small Fixes

- **UAT with Pastor Kathy and staff.** The hero carousel went out for review in July; no
  feedback is recorded yet.
- **End-to-end form tests** with real submissions, confirming they land in Supabase and show
  up in admin (not just that client-side validation works).
- **Email flow test** (confirmation, notifications), once Resend is verified.
- **Mobile pass** across remaining pages, plus a real-device check. So far only the footer
  (site-wide) and the About page tabs have been specifically fixed.
- **Hero carousel:** the last slide ("Youth Ministry") is still a gradient and needs a photo.
- **Audit the Give/Building Fund form** for validation consistency and Turnstile. (Prayer
  Wall submit and Praise Reports already have Turnstile; their validation style is not yet
  the inline-error pattern.)
- **Test task assignment emails** once a second staff account exists.
- **`sermons.youtube_id` is NOT NULL**, but `audio_url` and `facebook_url` exist and the admin
  page types `youtube_id` as optional. A sermon with no YouTube video probably can't be
  saved. Try one; fix if it fails.
- **Favicon.** Generated from the AME Zion triangle logo (`favicon.ico`,
  `apple-touch-icon.png`) but NOT applied, because the final logo isn't confirmed.

---

## ✅ Built & Working

### Public Site
- Home, About Us (Our Story / What We Believe / Leadership / AME Zion Heritage), Ministries,
  Events, Bulletin, Get Connected (Visitor Card, Join, Message Pastor, Connect Groups),
  Prayer Wall, Give + Building Fund
- Media section (Sermons, Live Stream, Gallery, Downloads, Worship Music)
- Hero carousel: auto-rotates, arrows/dots, pause on hover. Real photos of the church
  building, Pastor Kathy, and two community outreach events
- Privacy Policy page, linked in the footer

### Member Portal
- `/portal` sign up / sign in with inline per-field validation (email format, password
  strength, phone format)
- Email confirmation → admin approval flow. The `members` row is created by a database
  trigger, not by the client
- `/portal/account`: profile editing and granular directory sharing (directory opt-in,
  share email, share phone)
- `/portal/directory`: reads the `public_directory` view, which nulls out email/phone the
  member chose not to share. **This is only airtight once item 3 of the security fixes
  above is applied** — until then the raw `members` table could be queried directly.
- `/admin/members` (approval) and `/admin/directory` (full staff view)

### Security
- `middleware.ts`: server-side protection for `/admin/*`, `/portal/account`, and
  `/portal/directory`, using cookie-based `@supabase/ssr` sessions
- `checkAuth()` in `admin/page.tsx` signs out and redirects anyone with no `admin_roles` row
- RLS on all 12 tables (verified enabled). The six submission tables (prayer requests,
  praise reports, visitor cards, join applications, pastor messages, connect group
  signups) are restricted to pastor/super_admin for reads and updates, with public INSERT only
- One shared Supabase client (`lib/supabase.ts`) replaced ~10 separate instances
- Forgot password flow (`/auth` → `/auth/reset-password`)
- `admin_roles` has no INSERT policy, so the only way to add a role is the service-role route
  `/api/admin/add-role`. That route must check the caller itself, because it bypasses RLS
  (see Do First: it did not until the October 2026 fix)

### Admin Dashboard
- Submissions management (approve, soft-delete, restore)
- Task assignment with email notifications
- Bulletins, Events, Sermons management
- Roles management (`/admin/roles`)

### Forms
- Visitor Card, Join, Message Pastor, Connect Groups, Portal, and Auth all use inline
  per-field errors (no native browser popups), email format checks, phone auto-formatting with
  a 10-digit completeness check, and required-field rules matching each form

### Branding
- AME Zion triangle logo in header and footer
- Gold "Back to Home" links on `/auth`, `/admin`, and `/portal/*`

---

## 🔧 In Progress: Code Quality Refactor

Goal: make the project easy for another developer to pick up.

| Item | Status |
|------|--------|
| README with setup, architecture, and the two-auth-system explanation | ✅ Done |
| Schema docs in `supabase/schema/` | 🟡 In progress |
| Shared design system (colors, gradients, cards) | ⬜ Not started |
| Remove form duplication (`Field`, `formatPhone`, validation) | ⬜ Not started |
| Automated tests (Vitest + React Testing Library suggested) | ⬜ Not started |
| Comments explaining intent | ⬜ Do as files are touched |

**Schema docs status:**
- `01_tables.sql`: columns verified against the live database. Constraints (primary keys,
  foreign keys, CHECKs, uniques) NOT yet verified
- `02_rls_policies.sql`: ✅ rewritten November 2026 from the live policies
- `03_triggers_and_views.sql`: ✅ rewritten; only the `is_super_admin()` definition is
  still missing (query is in the file)
- `04_security_hardening.sql`: ✅ applied live; sections 5–6 added November 2026

---

## 🟢 After Launch

**Admin:** clickable mailto links on submitter emails; confirm the Roles link shows only for
`super_admin`

**Features:** event RSVP with capacity limits; photo gallery management; live stream embed;
email newsletter; push notifications

**Growth:** Google Search Console + sitemap (worth doing right after the domain goes live);
Google My Business; giving analytics dashboard; SEO meta tags

**Security & performance:** two-factor authentication for staff (worth doing soon after
launch); rate limiting per IP (see Security Status: Turnstile is not enforced server-side, so this is more important than it looks); image
optimization; Lighthouse audit

---

## Notable Past Bugs

- **Service-role API routes bypass RLS and aren't covered by `middleware.ts`:** its matcher
  only lists page paths, so every route under `/api/` must verify the caller itself before
  doing anything. The add-role route didn't, which let anyone grant themselves super admin.

- **"Multiple GoTrueClient instances" warning:** caused by calling `createClient()` in
  pages instead of using `lib/supabase.ts`. Will return if a new page skips the shared client.
- **RLS returns empty results with no error:** when a query unexpectedly returns nothing,
  check RLS before assuming a frontend bug. Postgres omits blocked rows silently.
- **`auth.uid() IS NOT NULL` / `auth.role() = 'authenticated'` policies:** these mean "anyone
  who has an account," not "staff." Found on the submission tables first, then again on
  `bulletins`, `events`, `sermons`, and `admin_roles`. Always check `admin_roles` instead.
- **RLS can't limit which columns an update changes:** this let a member change their own
  `status`. Use a trigger (see `protect_member_admin_fields`) or a view.
- **Signup success message never showing:** `switchMode()` resets `success`, so calling it
  right after `setSuccess()` wiped the message.
- **Resend "can only send to your own email":** unverified-domain limit; resolved by
  verifying the domain.
- **"Invalid email or password" can mean the database is paused**, not a wrong password.
  Check the Supabase project status first.
- **Remove button on the roles page did nothing:** RLS silently blocked the delete (no DELETE
  policy). The UI showed no error. Any button that "does nothing" is an RLS suspect.
- **Supabase free-tier auto-pause:** the project paused after inactivity and took the whole
  site's data features down until it was resumed.
- **Uploaded `.png` that wouldn't open:** it was actually an iPhone HEIC photo. Convert before
  adding to `public/images/`.