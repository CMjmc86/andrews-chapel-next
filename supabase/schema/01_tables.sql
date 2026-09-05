-- ============================================================
-- BASELINE SNAPSHOT — Tables
-- See README.md in this folder for important caveats about
-- confidence level per table before trusting this as complete.
-- ============================================================

-- ── admin_roles ──────────────────────────────────────────────
-- Staff role assignments. Role in ('super_admin','tech_admin','pastor','leader').
-- ⚠️ Columns below are known from application code; verify full definition
--    (constraints, defaults) against the live dashboard.
create table if not exists admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('super_admin', 'tech_admin', 'pastor', 'leader')),
  email text,
  created_at timestamptz not null default now()
);

-- ── members ──────────────────────────────────────────────────
-- Congregation member portal accounts. Built and fully verified in this project.
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null default '',
  email text not null,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  directory_opt_in boolean not null default false,
  share_email boolean not null default true,
  share_phone boolean not null default true,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

-- ── prayer_requests ──────────────────────────────────────────
create table if not exists prayer_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  display_name text,
  email text,
  phone text,
  request text,
  category text,
  is_anonymous boolean default false,
  is_private boolean default false,
  approved boolean default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── praise_reports ───────────────────────────────────────────
-- Note: no is_private column — praise reports have no "private" option,
-- only anonymous vs. named. Confirmed via information_schema query.
create table if not exists praise_reports (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  report text,
  is_anonymous boolean default false,
  approved boolean default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── visitor_cards ────────────────────────────────────────────
create table if not exists visitor_cards (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  address text,
  birthdate date,
  home_church text,
  how_did_you_hear text,
  interests text,
  prayer_needs text,
  first_visit boolean default false,
  follow_up boolean default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── join_applications ────────────────────────────────────────
create table if not exists join_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  birthdate date,
  address text,
  how_joining text,
  previous_church text,
  baptized boolean default false,
  ministry_interests text,
  testimony text,
  notes text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── pastor_messages ──────────────────────────────────────────
create table if not exists pastor_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  phone text,
  subject text,
  message text,
  anonymous boolean default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── connect_group_signups ────────────────────────────────────
create table if not exists connect_group_signups (
  id uuid primary key default gen_random_uuid(),
  group_name text,
  first_name text,
  last_name text,
  email text,
  phone text,
  contact_preference text,
  notes text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ── tasks ────────────────────────────────────────────────────
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid references auth.users(id),
  assigned_by uuid references auth.users(id),
  assigned_to_email text,
  assigned_by_email text,
  related_table text,
  related_id uuid,
  status text default 'pending',
  due_date date,
  created_at timestamptz not null default now()
);

-- ── bulletins / events / sermons ─────────────────────────────
-- ⚠️ LOW CONFIDENCE: these tables exist and are actively used in the admin
-- dashboard (admin/bulletins, admin/events, admin/sermons), but their exact
-- column definitions were not reconstructed in detail during this project's
-- working sessions. Run the verification query in README.md against the
-- live database and update this section before relying on it.
--
-- Known from context:
--   bulletins: likely title, content (rich text via Tiptap), published/visible
--              flag, created_at
--   events:    likely title, description, event_date, event_time, location,
--              published/visible flag, created_at
--   sermons:   likely title, pastor, sermon_date, youtube_id, audio_url,
--              published/visible flag, created_at
