# Andrews Chapel A.M.E. Zion Church — Website

Official website for Andrews Chapel A.M.E. Zion Church, Bunnlevel, NC. Pastor Kathy Grace.

**Live site:** andrews-chapel-next.vercel.app (custom domain pending — see PROJECT_STATUS.md)
**Repo:** github.com/CMjmc86/andrews-chapel-next

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (inline styles for gradients/theme colors — see PROJECT_STATUS.md for planned cleanup)
- **Database & Auth:** Supabase (Postgres + Auth, cookie-based sessions via `@supabase/ssr`)
- **Hosting:** Vercel
- **Transactional Email:** Resend
- **Bot Protection:** Cloudflare Turnstile (on all public forms)
- **Error Monitoring:** Sentry
- **Analytics:** Vercel Web Analytics

---

## Getting Started

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`.

### Required Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only, used in /api/admin/add-role
RESEND_API_KEY=                      # or configured directly in Supabase SMTP settings
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Ask the project owner for actual values — never commit real keys to the repo.

---

## Project Structure

```
src/
├── middleware.ts              # Server-side route protection for /admin/* and /portal/*
├── app/
│   ├── (public)/               # Public site — home, about, ministries, events, give, etc.
│   ├── admin/                  # Staff dashboard (requires admin_roles entry)
│   ├── portal/                 # Member portal (requires approved members entry)
│   ├── auth/                   # Staff sign in/up + forgot password
│   ├── api/                    # Server-side API routes (notify, verify-turnstile, admin/add-role)
├── components/ui/              # Shared UI components (SiteHeader, SiteFooter, HeroCarousel)
├── lib/
│   ├── supabase.ts             # The ONE shared Supabase client (cookie-based). Always import
│   │                            # from here — never call createClient() directly in a page.
│   ├── roles.ts                # Staff role helpers (getUserRole, canManageRoles, etc.)
│   └── members.ts              # Member helpers
```

---

## Authentication — Two Separate Systems

This site has **two independent authentication flows** that share the same underlying
Supabase Auth users table, but are gated by different application tables. Understanding
this distinction is critical before touching any auth-related code.

### 1. Staff (`/auth` → `/admin`)
- Gated by the `admin_roles` table (`super_admin`, `tech_admin`, `pastor`, `leader`)
- `middleware.ts` blocks any request to `/admin/*` without a valid `admin_roles` entry
- Role-based permissions defined in `lib/roles.ts` (`canManageRoles`, `canAssignTasks`, etc.)

### 2. Members (`/portal` → `/portal/account`)
- Gated by the `members` table (`status`: pending / approved / rejected)
- New signups create a `pending` row automatically via a database trigger (`handle_new_member`)
  on `auth.users` insert — **not** a client-side insert (this avoids a race condition with
  email confirmation; see PROJECT_STATUS.md for the history of why)
- Pastor/super_admin approve pending members at `/admin/members`
- `middleware.ts` blocks `/portal/account` and `/portal/directory` unless `status = 'approved'`

### Shared Supabase Client
Every page/component **must** import the shared client:
```ts
import { supabase } from "@/lib/supabase";
```
Do **not** call `createClient()` directly anywhere outside `lib/supabase.ts` and the
service-role API routes. Multiple separate client instances previously caused real bugs
(session state not syncing between pages) — see PROJECT_STATUS.md.

---

## Database

Schema and RLS policies currently live in the Supabase dashboard. Migration files tracking
this in the repo are planned — see PROJECT_STATUS.md. Until then, the source of truth is
the live Supabase project.

**Key tables:** `prayer_requests`, `praise_reports`, `visitor_cards`, `join_applications`,
`pastor_messages`, `connect_group_signups`, `admin_roles`, `members`, `tasks`, `bulletins`,
`events`, `sermons`.

**Security model:** Row Level Security (RLS) on every table. Public forms allow anonymous
`INSERT` only. Staff reads/writes require an `admin_roles` entry with the correct role,
enforced via `exists (select 1 from admin_roles where user_id = auth.uid() and role in (...))`
policies — not just `auth.role() = 'authenticated'`, which was a real vulnerability found
and fixed (any signed-in user, including pending members, could previously read/write staff
data). See PROJECT_STATUS.md for full history.

---

## Deployment

Auto-deploys to Vercel on push to `main`. Environment variables must be set separately in
the Vercel dashboard (production) — they are not read from `.env.local`.

---

## Further Reading

See `PROJECT_STATUS.md` for what's currently done, in progress, and still open — including
known issues, architectural decisions made along the way, and the pre-launch checklist.
