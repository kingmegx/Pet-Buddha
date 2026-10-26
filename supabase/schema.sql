-- Pet Buddha: saved dog profiles. Run once in Supabase → SQL Editor.
-- Each row is one dog; `profile` holds the answers to the questions.
-- Row level security means a person can only ever read or change their own dogs.

create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  profile jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists dogs_owner_idx on public.dogs (owner);

alter table public.dogs enable row level security;

create policy "Read own dogs" on public.dogs for select using (auth.uid() = owner);
create policy "Add own dogs" on public.dogs for insert with check (auth.uid() = owner);
create policy "Change own dogs" on public.dogs for update using (auth.uid() = owner) with check (auth.uid() = owner);
create policy "Remove own dogs" on public.dogs for delete using (auth.uid() = owner);
