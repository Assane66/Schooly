-- Schooly : tableau de communication interne par établissement.
-- Cette requête ajoute les annonces ; elle ne supprime aucune donnée existante.

create table if not exists public.school_announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 180),
  body text not null check (char_length(body) between 2 and 5000),
  audience text not null default 'school' check (audience in ('school', 'staff', 'families')),
  published_at timestamptz not null default now(),
  expires_at date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists school_announcements_school_published_idx
  on public.school_announcements (school_id, published_at desc);

alter table public.school_announcements enable row level security;

create policy school_announcements_read_member on public.school_announcements
  for select to authenticated
  using (schooly_private.is_approved_school_member(school_id));

create policy school_announcements_manage_leader on public.school_announcements
  for all to authenticated
  using (schooly_private.can_manage_roles(school_id))
  with check (schooly_private.can_manage_roles(school_id));
