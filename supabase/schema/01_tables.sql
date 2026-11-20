-- ============================================================
-- Tables — verified snapshot
--
-- Columns, types, nullability, and defaults below were verified against
-- the live database with:
--
--   select table_name, column_name, data_type, is_nullable, column_default
--   from information_schema.columns
--   where table_schema = 'public'
--   order by table_name, ordinal_position;
--
-- NOT YET VERIFIED: constraints (primary keys, foreign keys, CHECKs,
-- unique constraints). That query cannot show them. Only `members` has
-- constraints written in, because we created that table ourselves.
-- See the TODO at the bottom of this file.
-- ============================================================

-- ── admin_roles ──────────────────────────────────────────────
-- Staff role assignments. Roles used by the app: super_admin, tech_admin,
-- pastor, leader (see src/lib/roles.ts). Rows are added through the
-- service-role API route /api/admin/add-role, never directly by clients.
create table if not exists admin_roles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  role text not null,
  created_at timestamptz default now(),
  email text
);

-- ── members ──────────────────────────────────────────────────
-- Congregation member portal accounts. Rows are created automatically by
-- the handle_new_member() trigger on auth.users (see 03_triggers_and_views.sql).
-- Constraints here are the ones we created with this table.
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  full_name text not null default '',
  email text not null,
  phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  directory_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  share_email boolean not null default true,
  share_phone boolean not null default true
);

-- ── prayer_requests ──────────────────────────────────────────
-- Note: no name/email/phone columns. Submitters are identified only by
-- display_name (or is_anonymous).
create table if not exists prayer_requests (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  display_name text,
  category text,
  request text not null,
  is_anonymous boolean default false,
  is_private boolean default false,
  approved boolean default false,
  deleted_at timestamptz
);

-- ── praise_reports ───────────────────────────────────────────
-- Note: no is_private column — praise reports are either named or anonymous.
create table if not exists praise_reports (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  display_name text,
  report text not null,
  is_anonymous boolean default false,
  approved boolean default false,
  deleted_at timestamptz
);

-- ── visitor_cards ────────────────────────────────────────────
create table if not exists visitor_cards (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  address text,
  how_did_you_hear text,
  interests text,
  prayer_needs text,
  first_visit boolean default false,
  follow_up boolean default false,
  birthdate date,
  home_church text,
  deleted_at timestamptz
);

-- ── join_applications ────────────────────────────────────────
-- The Join form requires phone and birthdate in the UI, but the database
-- allows them to be null.
create table if not exists join_applications (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  birthdate date,
  address text,
  how_joining text,
  previous_church text,
  baptized boolean default false,
  ministry_interests text,
  testimony text,
  notes text,
  deleted_at timestamptz
);

-- ── pastor_messages ──────────────────────────────────────────
-- first_name / last_name are null when the message is sent anonymously.
create table if not exists pastor_messages (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text,
  last_name text,
  email text not null,
  phone text,
  subject text,
  message text not null,
  anonymous boolean default false,
  deleted_at timestamptz
);

-- ── connect_group_signups ────────────────────────────────────
create table if not exists connect_group_signups (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz default now(),
  group_name text not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  contact_preference text,
  notes text,
  deleted_at timestamptz
);

-- ── tasks ────────────────────────────────────────────────────
-- assigned_to has a foreign key to auth.users (confirmed by the
-- tasks_assigned_to_fkey error when deleting a user that still had tasks).
create table if not exists tasks (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid,
  assigned_by uuid,
  assigned_to_email text,
  assigned_by_email text,
  related_table text,
  related_id uuid,
  status text default 'pending',
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

-- ── bulletins ────────────────────────────────────────────────
-- content is rich text (HTML from the Tiptap editor). Public pages show
-- only rows where is_active = true.
create table if not exists bulletins (
  id uuid not null default gen_random_uuid(),
  title text not null,
  content text not null,
  is_active boolean default false,
  published_at timestamptz,
  created_by uuid,
  created_by_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── events ───────────────────────────────────────────────────
-- Public pages show only rows where is_published = true.
create table if not exists events (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  event_time time,
  end_time time,
  location text,
  is_published boolean default false,
  created_by uuid,
  created_by_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── sermons ──────────────────────────────────────────────────
-- Public pages show only rows where is_published = true.
-- Note: youtube_id is NOT NULL, while audio_url and facebook_url are
-- optional. A sermon with no YouTube video can't currently be saved.
create table if not exists sermons (
  id uuid not null default gen_random_uuid(),
  title text not null,
  pastor text default 'Pastor Kathy Grace',
  sermon_date date not null,
  youtube_id text not null,
  scripture text,
  series text,
  description text,
  is_published boolean default false,
  created_by uuid,
  created_by_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  audio_url text,
  facebook_url text
);

-- ── TODO: verify constraints ─────────────────────────────────
-- Run this and add the results here (primary keys, foreign keys, CHECKs,
-- unique constraints) for every table except members:
--
--   select conrelid::regclass as table_name, conname,
--          pg_get_constraintdef(oid) as definition
--   from pg_constraint
--   where connamespace = 'public'::regnamespace
--   order by conrelid::regclass::text, conname;
