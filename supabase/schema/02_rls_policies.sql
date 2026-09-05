-- ============================================================
-- BASELINE SNAPSHOT — Row Level Security Policies
-- High confidence — verified via pg_policies queries against
-- the live database during active security remediation work.
-- ============================================================

-- Enable RLS on all tables (should already be enabled — this is
-- here for completeness/disaster-recovery purposes)
alter table prayer_requests enable row level security;
alter table praise_reports enable row level security;
alter table visitor_cards enable row level security;
alter table join_applications enable row level security;
alter table pastor_messages enable row level security;
alter table connect_group_signups enable row level security;
alter table members enable row level security;

-- ── prayer_requests ──────────────────────────────────────────
create policy "Allow public inserts" on prayer_requests for insert with check (true);

create policy "Allow public selects" on prayer_requests for select
  using (approved = true and is_private = false);

create policy "Admins can read prayer_requests" on prayer_requests for select
  using (
    exists (select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('pastor', 'super_admin'))
  );

create policy "Admins can update prayer_requests" on prayer_requests for update
  using (
    exists (select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('pastor', 'super_admin'))
  );

-- ── praise_reports ───────────────────────────────────────────
-- Note: no is_private check here — praise_reports has no such column.
create policy "Allow public inserts" on praise_reports for insert with check (true);

create policy "Allow public selects" on praise_reports for select
  using (approved = true);

create policy "Admins can read praise_reports" on praise_reports for select
  using (
    exists (select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('pastor', 'super_admin'))
  );

create policy "Admins can update praise_reports" on praise_reports for update
  using (
    exists (select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('pastor', 'super_admin'))
  );

-- ── visitor_cards, join_applications, pastor_messages, connect_group_signups ──
-- These four tables share the same pattern: public can insert (submit the
-- form), but only pastor/super_admin can ever read or update — no public
-- select policy exists, since this data has no public-facing display.

create policy "Allow public inserts" on visitor_cards for insert with check (true);
create policy "Admins can read visitor_cards" on visitor_cards for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));
create policy "Admins can update visitor_cards" on visitor_cards for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));

create policy "Allow public inserts" on join_applications for insert with check (true);
create policy "Admins can read join_applications" on join_applications for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));
create policy "Admins can update join_applications" on join_applications for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));

create policy "Allow public inserts" on pastor_messages for insert with check (true);
create policy "Admins can read pastor_messages" on pastor_messages for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));
create policy "Admins can update pastor_messages" on pastor_messages for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));

create policy "Allow public inserts" on connect_group_signups for insert with check (true);
create policy "Admins can read connect_group_signups" on connect_group_signups for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));
create policy "Admins can update connect_group_signups" on connect_group_signups for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid() and admin_roles.role in ('pastor', 'super_admin')));

-- ── members ──────────────────────────────────────────────────
create policy "Members can view own record" on members for select
  using (auth.uid() = user_id);

create policy "Members can update own record" on members for update
  using (auth.uid() = user_id);

create policy "Users can create own member record" on members for insert
  with check (auth.uid() = user_id);

create policy "Members can view directory opt-ins" on members for select
  using (status = 'approved' and directory_opt_in = true);

create policy "Admins can read all members" on members for select
  using (
    exists (select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('pastor', 'super_admin'))
  );

create policy "Admins can update all members" on members for update
  using (
    exists (select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('pastor', 'super_admin'))
  );

-- ── admin_roles ──────────────────────────────────────────────
-- ⚠️ LOW CONFIDENCE: RLS policies on admin_roles itself were not directly
-- audited during this project's security review (we secured the tables
-- admin_roles GRANTS access to, not admin_roles itself). Verify this table
-- has appropriate RLS before considering the security review complete —
-- specifically, confirm a non-admin cannot INSERT their own admin_roles row.
