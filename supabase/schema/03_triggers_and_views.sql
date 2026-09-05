-- ============================================================
-- BASELINE SNAPSHOT — Triggers & Views
-- High confidence — verified working in production.
-- ============================================================

-- ── handle_new_member() trigger ──────────────────────────────
-- Fires automatically when a new row is inserted into auth.users
-- (i.e. on every signup, staff or member). Creates a matching
-- `members` row with status='pending'.
--
-- WHY THIS EXISTS AS A TRIGGER, NOT A CLIENT-SIDE INSERT:
-- Supabase Auth's email confirmation flow means there is no active
-- session immediately after signUp() — meaning a client-side insert
-- into `members` right after signup would run unauthenticated and
-- get silently blocked by RLS (Postgres does not throw an error when
-- RLS blocks a row, it just omits it — this caused real confusion
-- during development before the trigger was introduced). The trigger
-- runs with elevated privileges independent of the client's session
-- state, avoiding this race condition entirely.
create or replace function public.handle_new_member()
returns trigger as $$
begin
  insert into public.members (user_id, email, full_name, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_member();

-- ── public_directory view ────────────────────────────────────
-- Used by /portal/directory. Enforces granular per-field sharing
-- (share_email / share_phone) at the DATABASE level — an unshared
-- value is never sent to the browser at all, not just hidden in
-- the UI. Only returns approved + opted-in members.
create or replace view public_directory as
select
  id,
  full_name,
  case when share_email then email else null end as email,
  case when share_phone then phone else null end as phone,
  directory_opt_in
from members
where status = 'approved'
  and directory_opt_in = true;

revoke all on public_directory from public;
grant select on public_directory to authenticated;
