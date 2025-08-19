create extension if not exists pgcrypto;

create table if not exists public.knocks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  attachment_url text,
  status text not null default 'pending'
    check (status in ('pending','approved','declined','archived')),
  reviewer text,
  reviewed_at timestamptz,
  sender_fingerprint text,
  source_ip inet,
  meta jsonb not null default '{}'::jsonb
);

create index if not exists knocks_created_at_idx on public.knocks (created_at desc);
create index if not exists knocks_status_idx on public.knocks (status);

alter table public.knocks enable row level security;

create policy "anon can insert knocks"
on public.knocks
for insert
to anon
with check (true);
