-- ============================================================
-- Supabase iestatīšana vēlmju sarakstam.
-- Iekopē šo Supabase projektā → SQL Editor → palaiž (Run).
-- Droši palaist atkārtoti — tas neizdzēš esošos datus.
-- (Paste into Supabase → SQL Editor → Run. Safe to re-run.)
-- ============================================================

-- 1) Tabula rezervācijām
create table if not exists reservations (
  id          bigint generated always as identity primary key,
  gift_id     text not null unique,           -- viena dāvana = viena rezervācija
  name        text not null,
  token       text,                           -- slepens tokens; zina tikai rezervētāja pārlūks
  created_at  timestamptz not null default now()
);

-- (Ja tabula jau pastāvēja bez 'token' kolonnas)
alter table reservations add column if not exists token text;

-- 2) Row Level Security
alter table reservations enable row level security;

-- Visi (anonīmie viesi) drīkst REDZĒT rezervācijas...
drop policy if exists "public can read reservations" on reservations;
create policy "public can read reservations"
  on reservations for select to anon using (true);

-- ...BET tokens nedrīkst būt nolasāms (citādi varētu atcelt cita rezervāciju).
revoke select on reservations from anon, authenticated;
grant  select (id, gift_id, name, created_at) on reservations to anon, authenticated;

-- Visi drīkst PIEVIENOT rezervāciju
drop policy if exists "public can insert reservations" on reservations;
create policy "public can insert reservations"
  on reservations for insert to anon with check (true);

-- (Tieša dzēšana viesiem ir aizliegta — to dara tikai zemāk esošā funkcija.)

-- 3) Atcelšanas funkcija: izdzēš rezervāciju TIKAI tad, ja sakrīt slepenais tokens.
--    Tā kā tā ir SECURITY DEFINER, tā drīkst dzēst, lai gan viesiem tiešas tiesības nav.
create or replace function cancel_reservation(p_gift_id text, p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count int;
begin
  delete from reservations
   where gift_id = p_gift_id and token = p_token and token is not null;
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

grant execute on function cancel_reservation(text, text) to anon, authenticated;
