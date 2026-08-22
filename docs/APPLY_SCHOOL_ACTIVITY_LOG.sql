-- Journal d’activité Schooly : actions sensibles de plateforme et d’établissement.
-- Cette requête ajoute des tables et règles ; elle ne supprime aucune donnée existante.

create table if not exists public.school_activity_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(trim(action)) between 3 and 100),
  summary text not null check (char_length(trim(summary)) between 3 and 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists school_activity_logs_school_created_idx
  on public.school_activity_logs(school_id, created_at desc);
create index if not exists school_activity_logs_created_idx
  on public.school_activity_logs(created_at desc);

alter table public.school_activity_logs enable row level security;

create or replace function public.log_schooly_activity(
  p_school_id uuid,
  p_action text,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, schooly_private
as $$
declare
  created_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authenticated user required';
  end if;

  if not schooly_private.is_platform_admin()
     and (p_school_id is null or not schooly_private.is_approved_school_member(p_school_id)) then
    raise exception 'School membership or platform administrator required';
  end if;

  insert into public.school_activity_logs(school_id, actor_id, action, summary, metadata)
  values (p_school_id, auth.uid(), trim(p_action), trim(p_summary), coalesce(p_metadata, '{}'::jsonb))
  returning id into created_id;

  return created_id;
end;
$$;

revoke all on function public.log_schooly_activity(uuid, text, text, jsonb) from public, anon;
grant execute on function public.log_schooly_activity(uuid, text, text, jsonb) to authenticated;

drop policy if exists school_activity_logs_platform_read on public.school_activity_logs;
create policy school_activity_logs_platform_read
  on public.school_activity_logs for select to authenticated
  using (schooly_private.is_platform_admin());

drop policy if exists school_activity_logs_school_leader_read on public.school_activity_logs;
create policy school_activity_logs_school_leader_read
  on public.school_activity_logs for select to authenticated
  using (school_id is not null and schooly_private.can_manage_roles(school_id));
