# Database Schema — Baseline Snapshot

This folder documents the Supabase database schema as of **July 2026**. It exists because,
until now, the live Supabase dashboard was the *only* record of the schema and RLS
policies — meaning there was no way to see "what does the database look like" without
logging into Supabase directly, and no tracked history of how it got that way.

## Important: this is a snapshot, not a true migration chain

These files describe the current state, reconstructed from the actual work done to build
and secure the database. They are **not** sequential migrations that were actually run in
this order — the real changes happened incrementally, ad-hoc, directly in Supabase's SQL
Editor over several sessions.

**Confidence level by file:**
- `01_tables.sql` — Tables we built/modified directly in detail (`members`) are accurate.
  Tables referenced but not built from scratch in this project's working sessions
  (`bulletins`, `events`, `sermons`, `admin_roles`) have their known columns listed, but
  **should be verified against the live Supabase dashboard** before being trusted as
  complete — they may have additional columns not captured here.
- `02_rls_policies.sql` — High confidence. These are the exact policies verified via
  `pg_policies` queries during active security work.
- `03_triggers_and_views.sql` — High confidence, verified working in production.

## Recommended next step

For genuine, going-forward migration tracking (not just this one-time snapshot), set up
the [Supabase CLI](https://supabase.com/docs/guides/cli) and use `supabase db diff` /
`supabase migration new` for any future schema changes, so they're captured automatically
as they happen instead of needing to be reconstructed later.

## How to verify this snapshot

Run this in Supabase SQL Editor and compare against `01_tables.sql`:

```sql
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;
```

And this to compare against `02_rls_policies.sql`:

```sql
select tablename, policyname, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```
