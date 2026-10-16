-- Security hardening from Docs/security-audit-2026-10-16.md.
-- Run once in the Supabase SQL Editor on databases created from the old schema.sql.

-- #4: signed-in users must not be able to change credits_remaining.
revoke update on public.users from anon, authenticated;
grant update (email) on public.users to authenticated;

-- #3: 3-day pass support and idempotent Stripe webhook writes.
alter table public.passes drop constraint if exists passes_type_check;
alter table public.passes add constraint passes_type_check check (type in ('3d', '7d', '30d'));
alter table public.passes add column if not exists stripe_session_id text unique;

alter table public.payments drop constraint if exists payments_type_check;
alter table public.payments add constraint payments_type_check
  check (type in ('credits_50', 'pass_3d', 'pass_7d', 'pass_30d'));
alter table public.payments add constraint payments_stripe_session_id_key unique (stripe_session_id);

-- #10: scan_cache is server-only.
alter table public.scan_cache enable row level security;

-- Pin search_path on the security definer trigger function.
alter function public.handle_new_user() set search_path = public;
