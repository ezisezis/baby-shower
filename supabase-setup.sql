-- ============================================================
-- Supabase iestatīšana vēlmju sarakstam.
-- Iekopē šo Supabase projektā → SQL Editor → palaiž (Run).
-- (Paste this into your Supabase project → SQL Editor → Run.)
-- ============================================================

create table if not exists reservations (
  id          bigint generated always as identity primary key,
  gift_id     text not null unique,           -- viena dāvana = viena rezervācija
  name        text not null,
  created_at  timestamptz not null default now()
);

-- Ieslēdz drošības politikas (Row Level Security)
alter table reservations enable row level security;

-- Visi (anonīmie viesi) drīkst REDZĒT rezervācijas
drop policy if exists "public can read reservations" on reservations;
create policy "public can read reservations"
  on reservations for select
  to anon
  using (true);

-- Visi drīkst PIEVIENOT rezervāciju
drop policy if exists "public can insert reservations" on reservations;
create policy "public can insert reservations"
  on reservations for insert
  to anon
  with check (true);

-- (Apzināti NEDODAM tiesības dzēst/labot, lai viesi nevar atcelt cita rezervāciju.)
