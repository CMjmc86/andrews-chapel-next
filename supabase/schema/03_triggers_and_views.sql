-- ============================================================
-- 03 — Functions, triggers and views (LIVE STATE, November 2026)
-- ============================================================

-- ── has_admin_role(allowed text[]) ───────────────────────────
-- Used inside RLS policies. SECURITY DEFINER so it can read admin_roles without
-- recursing through admin_roles' own policies.
-- Do NOT revoke EXECUTE from anon: policies that call it are evaluated for public
-- reads too, and revoking causes "permission denied" on public pages.
create or replace function public.has_admin_role(allowed text[])
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.admin_roles
                 where user_id = auth.uid() and role = any(allowed));
$$;

-- ── is_super_admin() ─────────────────────────────────────────
-- EXISTS in the live database (SECURITY DEFINER) and is used by the tasks and
-- admin_roles policies. Its definition was never captured here. TODO: run
--   select pg_get_functiondef('public.is_super_admin'::regproc);
-- and paste the result. Known linter issue: it has no pinned search_path.
-- Fix:  alter function public.is_super_admin() set search_path = public;

-- ── handle_new_member() — creates the members row on signup ──
-- Fires on every auth.users insert and creates a members row with status
-- 'pending'. WHY A TRIGGER AND NOT A CLIENT INSERT: after signUp() there is no
-- session until the email is confirmed, so a client-side insert would run as
-- anonymous and be silently dropped by RLS.
create or replace function public.handle_new_member()
returns trigger as $$
begin
  insert into public.members (user_id, email, full_name, status)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data->>'full_name', ''), 'pending');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_member();

-- ── protect_member_admin_fields() — stops self-approval ──────
-- RLS can't restrict WHICH columns an update changes, so this trigger blocks
-- non-staff from changing approval/identity fields on members. auth.uid() is null
-- for SQL Editor / service-role operations, which are allowed through.
create or replace function public.protect_member_admin_fields()
returns trigger language plpgsql security definer set search_path = public as $$
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

-- ── public_directory view ────────────────────────────────────
-- Used by /portal/directory. Enforces per-field sharing in the database: an unshared
-- email/phone is never sent to the browser. Only approved + opted-in members appear,
-- and only an APPROVED member viewing the page gets any rows (the EXISTS clause).
-- The view runs with its owner's privileges, so it can read members despite RLS.
create or replace view public_directory as
select id, full_name,
       case when share_email then email else null end as email,
       case when share_phone then phone else null end as phone,
       directory_opt_in
from members
where status = 'approved'
  and directory_opt_in = true
  and exists (select 1 from members me
              where me.user_id = auth.uid() and me.status = 'approved');

revoke all on public_directory from public;
grant select on public_directory to authenticated;
