-- ============================================================
-- 04 — Security hardening (July 2026 audit)
--
-- Fixes found by auditing pg_policies:
--   1. bulletins / events / sermons writable by ANY signed-in user
--   2. members could self-approve by updating their own status
--   3. members table readable by any signed-in user, bypassing the
--      per-field sharing enforced by the public_directory view
--   4. admin_roles readable by any signed-in user
--
--   5. admin_roles had no DELETE policy (Remove button did nothing)
--   6. prayer/praise: public could insert pre-approved rows; deleted rows stayed visible
--
-- Safe to re-run (uses drop ... if exists / create or replace).
-- ============================================================

-- ── Helper: role check that can be used inside policies ──────
-- SECURITY DEFINER so it can read admin_roles without recursing
-- through admin_roles' own RLS policies.
-- NOTE: do not revoke EXECUTE from anon. Policies that call this are
-- evaluated for public (anon) reads too, and revoking would cause
-- "permission denied" errors on public pages.
create or replace function public.has_admin_role(allowed text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
      and role = any(allowed)
  );
$$;

-- ── Make sure RLS is actually ON (harmless if already enabled) ──
alter table admin_roles enable row level security;
alter table bulletins   enable row level security;
alter table events      enable row level security;
alter table sermons     enable row level security;
alter table tasks       enable row level security;

-- ── 1. Content tables: staff only, matching lib/roles.ts ─────
-- canManageBulletins / canManageEvents: super_admin, tech_admin, pastor
-- canManageSermons:                     super_admin, tech_admin
drop policy if exists "Admins can manage bulletins" on bulletins;
create policy "Staff can manage bulletins" on bulletins for all
  using      (public.has_admin_role(array['super_admin','tech_admin','pastor']))
  with check (public.has_admin_role(array['super_admin','tech_admin','pastor']));

drop policy if exists "Admins can manage events" on events;
create policy "Staff can manage events" on events for all
  using      (public.has_admin_role(array['super_admin','tech_admin','pastor']))
  with check (public.has_admin_role(array['super_admin','tech_admin','pastor']));

drop policy if exists "Admins can manage sermons" on sermons;
create policy "Staff can manage sermons" on sermons for all
  using      (public.has_admin_role(array['super_admin','tech_admin']))
  with check (public.has_admin_role(array['super_admin','tech_admin']));

-- ── 2. members: stop self-approval ───────────────────────────
-- RLS can't restrict which COLUMNS an update touches, so a trigger
-- blocks non-staff from changing approval/identity fields.
-- auth.uid() is null for SQL Editor / service-role operations, which
-- are allowed through.
create or replace function public.protect_member_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and (   new.status      is distinct from old.status
          or new.approved_at is distinct from old.approved_at
          or new.approved_by is distinct from old.approved_by
          or new.email       is distinct from old.email
          or new.user_id     is distinct from old.user_id)
     and not public.has_admin_role(array['pastor','super_admin'])
  then
    raise exception 'Only staff can change approval or identity fields on a member record';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_member_admin_fields on members;
create trigger protect_member_admin_fields
  before update on members
  for each row execute function public.protect_member_admin_fields();

-- The handle_new_member() trigger creates member rows, so a client-side
-- insert policy is unnecessary — and would let someone insert their own
-- row with status = 'approved' if no row existed yet.
drop policy if exists "Users can create own member record" on members;

-- ── 3. Directory: close the raw-table bypass ─────────────────
-- Previously any signed-in user could SELECT opted-in members straight
-- from the table (including email/phone regardless of share flags).
-- The view runs with its owner's privileges, so it doesn't need this policy.
drop policy if exists "Members can view directory opt-ins" on members;

-- Only approved members may read the directory view.
create or replace view public_directory as
select
  id,
  full_name,
  case when share_email then email else null end as email,
  case when share_phone then phone else null end as phone,
  directory_opt_in
from members
where status = 'approved'
  and directory_opt_in = true
  and exists (
    select 1 from members me
    where me.user_id = auth.uid()
      and me.status = 'approved'
  );

-- ── 4. admin_roles: users see their own row; senior staff see all ──
-- Everyone needs to read their OWN row (getUserRole, middleware, and the
-- policies on other tables all depend on it).
drop policy if exists "Admins can view roles" on admin_roles;
create policy "Staff can view roles" on admin_roles for select
  using (
    auth.uid() = user_id
    or public.has_admin_role(array['super_admin','tech_admin','pastor'])
  );

-- ── 5. admin_roles: super admins can remove roles (not their own) ──
-- The roles page's Remove button deletes directly; with no DELETE policy it
-- silently did nothing. Applied and verified November 2026.
drop policy if exists "Super admins can delete roles" on admin_roles;
create policy "Super admins can delete roles" on admin_roles for delete
  using (public.has_admin_role(array['super_admin']) and user_id <> auth.uid());

-- ── 6. Prayer / praise: no self-publishing, no showing deleted items ──
-- The old public insert policy was `with check (true)`, so anyone calling the API
-- directly could insert rows with approved = true and publish to the Prayer Wall.
-- The old select policies also kept showing items staff had soft-deleted.
drop policy if exists "Allow public inserts" on prayer_requests;
create policy "Allow public inserts" on prayer_requests for insert
  with check (approved is not true and deleted_at is null);
drop policy if exists "Allow public inserts" on praise_reports;
create policy "Allow public inserts" on praise_reports for insert
  with check (approved is not true and deleted_at is null);
alter policy "Allow public selects" on prayer_requests
  using (approved = true and is_private = false and deleted_at is null);
alter policy "Allow public selects" on praise_reports
  using (approved = true and deleted_at is null);
