-- ============================================================
-- 02 — Row Level Security policies (LIVE STATE, November 2026)
--
-- Rewritten from a pg_policies query against the live database after the
-- July–November 2026 security audit. If this file and the database ever
-- disagree, the database wins: re-run the query at the bottom and fix this file.
--
-- Rules these policies follow:
--   * "Signed in" is NOT "staff" — anyone can create an account. Staff checks
--     always go through admin_roles (via has_admin_role() or an EXISTS subquery).
--   * Public forms: anonymous INSERT only, and only rows that are not already
--     approved or deleted (so a visitor can't self-publish).
--   * RLS cannot limit which COLUMNS an UPDATE changes — see the
--     protect_member_admin_fields trigger in 03_triggers_and_views.sql.
--
-- Helper functions used here (defined in 03): has_admin_role(text[]), is_super_admin()
-- ============================================================

alter table admin_roles           enable row level security;
alter table bulletins             enable row level security;
alter table connect_group_signups enable row level security;
alter table events                enable row level security;
alter table join_applications     enable row level security;
alter table members               enable row level security;
alter table pastor_messages       enable row level security;
alter table praise_reports        enable row level security;
alter table prayer_requests       enable row level security;
alter table sermons               enable row level security;
alter table tasks                 enable row level security;
alter table visitor_cards         enable row level security;

-- ── admin_roles ──────────────────────────────────────────────
-- NO insert policy: roles are added only by /api/admin/add-role, which uses the
-- service-role key (bypasses RLS) and checks that the caller is a super_admin.
create policy "Staff can view roles" on admin_roles for select
  using (auth.uid() = user_id
         or public.has_admin_role(array['super_admin','tech_admin','pastor']));

create policy "Super admins can update roles" on admin_roles for update
  using (is_super_admin()) with check (is_super_admin());

-- Super admins can remove roles, but not their own (can't lock yourself out).
create policy "Super admins can delete roles" on admin_roles for delete
  using (public.has_admin_role(array['super_admin']) and user_id <> auth.uid());

-- ── bulletins / events / sermons ─────────────────────────────
-- Matches lib/roles.ts: bulletins + events = super_admin, tech_admin, pastor;
-- sermons = super_admin, tech_admin.
create policy "Public can view active bulletins" on bulletins for select
  using (is_active = true);
create policy "Staff can manage bulletins" on bulletins for all
  using      (public.has_admin_role(array['super_admin','tech_admin','pastor']))
  with check (public.has_admin_role(array['super_admin','tech_admin','pastor']));

create policy "Public can view published events" on events for select
  using (is_published = true);
create policy "Staff can manage events" on events for all
  using      (public.has_admin_role(array['super_admin','tech_admin','pastor']))
  with check (public.has_admin_role(array['super_admin','tech_admin','pastor']));

create policy "Public can view published sermons" on sermons for select
  using (is_published = true);
create policy "Staff can manage sermons" on sermons for all
  using      (public.has_admin_role(array['super_admin','tech_admin']))
  with check (public.has_admin_role(array['super_admin','tech_admin']));

-- ── prayer_requests ──────────────────────────────────────────
-- Public may submit (never pre-approved) and read only approved, non-private,
-- non-deleted requests.
create policy "Allow public inserts" on prayer_requests for insert
  with check (approved is not true and deleted_at is null);
create policy "Allow public selects" on prayer_requests for select
  using (approved = true and is_private = false and deleted_at is null);
create policy "Admins can read prayer_requests" on prayer_requests for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update prayer_requests" on prayer_requests for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

-- ── praise_reports (no is_private column) ────────────────────
create policy "Allow public inserts" on praise_reports for insert
  with check (approved is not true and deleted_at is null);
create policy "Allow public selects" on praise_reports for select
  using (approved = true and deleted_at is null);
create policy "Admins can read praise_reports" on praise_reports for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update praise_reports" on praise_reports for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

-- ── Other submission tables: public insert; pastor/super_admin read + update ──
-- visitor_cards, join_applications, pastor_messages, connect_group_signups
-- (The insert policies are `with check (true)`: these rows have no "approved"
--  state, so there is nothing to protect — spam is the open risk, see
--  PROJECT_STATUS.md on server-side Turnstile and rate limiting.)
create policy "Allow public inserts" on visitor_cards for insert with check (true);
create policy "Admins can read visitor_cards" on visitor_cards for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update visitor_cards" on visitor_cards for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

create policy "Allow public inserts" on join_applications for insert with check (true);
create policy "Admins can read join_applications" on join_applications for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update join_applications" on join_applications for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

create policy "Allow public inserts" on pastor_messages for insert with check (true);
create policy "Admins can read pastor_messages" on pastor_messages for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update pastor_messages" on pastor_messages for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

create policy "Allow public inserts" on connect_group_signups for insert with check (true);
create policy "Admins can read connect_group_signups" on connect_group_signups for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update connect_group_signups" on connect_group_signups for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

-- ── members ──────────────────────────────────────────────────
-- NO insert policy: rows are created by the handle_new_member trigger.
-- NO direct "directory" select policy: directory reads go through the
-- public_directory view, which enforces per-field sharing.
create policy "Members can view own record" on members for select
  using (auth.uid() = user_id);
-- Members may edit their own row, but the protect_member_admin_fields trigger
-- blocks changes to status / approved_at / approved_by / email / user_id.
create policy "Members can update own record" on members for update
  using (auth.uid() = user_id);
create policy "Admins can read all members" on members for select
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));
create policy "Admins can update all members" on members for update
  using (exists (select 1 from admin_roles where admin_roles.user_id = auth.uid()
                 and admin_roles.role in ('pastor','super_admin')));

-- ── tasks ────────────────────────────────────────────────────
create policy "Admins and pastors can create tasks" on tasks for insert
  with check (is_super_admin()
    or ((select admin_roles.role from admin_roles where admin_roles.user_id = auth.uid())
        = any (array['pastor','tech_admin'])));
create policy "Assignees can view their tasks" on tasks for select
  using (auth.uid() = assigned_to or is_super_admin());
create policy "Assignees can update their tasks" on tasks for update
  using (auth.uid() = assigned_to or is_super_admin());

-- ── To re-verify against the live database ───────────────────
-- select tablename, policyname, cmd, qual, with_check
-- from pg_policies where schemaname = 'public'
-- order by tablename, policyname;
