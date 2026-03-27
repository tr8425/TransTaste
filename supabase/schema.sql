-- TransTaste Database Schema
-- Run this in Supabase SQL Editor

-- Users (extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credits_remaining integer default 10,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.users enable row level security;
create policy "Users can read own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

-- User Settings (language + allergy preset)
create table public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  output_language text default 'en',
  menu_language text default 'auto',
  allergen_preset text[] default '{}',
  dietary_beliefs text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;
create policy "Users can read own settings" on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can update own settings" on public.user_settings for update using (auth.uid() = user_id);
create policy "Users can insert own settings" on public.user_settings for insert with check (auth.uid() = user_id);

-- Trip Passes
create table public.passes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  type text check (type in ('7d', '30d')),
  starts_at timestamptz default now(),
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table public.passes enable row level security;
create policy "Users can read own passes" on public.passes for select using (auth.uid() = user_id);

-- Scan Cache
create table public.scan_cache (
  id uuid default gen_random_uuid() primary key,
  dish_hash text unique not null,
  result_json jsonb not null,
  input_type text check (input_type in ('image', 'url', 'text')),
  language_src text,
  language_tgt text,
  hit_count integer default 0,
  created_at timestamptz default now()
);

-- No RLS on scan_cache (shared across users)

-- Scan History
create table public.scan_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  dish_hash text,
  menu_language text,
  restaurant_type text,
  items_count integer,
  result_preview jsonb,
  scanned_at timestamptz default now()
);

alter table public.scan_history enable row level security;
create policy "Users can read own history" on public.scan_history for select using (auth.uid() = user_id);
create policy "Users can insert own history" on public.scan_history for insert with check (auth.uid() = user_id);

-- Payments
create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  type text check (type in ('credits_50', 'pass_7d', 'pass_30d')),
  amount_usd numeric(6,2),
  stripe_session_id text,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;
create policy "Users can read own payments" on public.payments for select using (auth.uid() = user_id);

-- Phrase Favorites
create table public.phrase_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  phrase_key text not null,
  created_at timestamptz default now(),
  unique(user_id, phrase_key)
);

alter table public.phrase_favorites enable row level security;
create policy "Users can manage own favorites" on public.phrase_favorites for all using (auth.uid() = user_id);

-- Auto-create user record on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, credits_remaining)
  values (new.id, new.email, 10);
  insert into public.user_settings (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
