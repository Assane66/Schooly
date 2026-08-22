-- Schooly — avertissements, pause et reprise d'établissement.
-- Cette migration ne supprime aucune donnée existante.

create table if not exists public.school_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  event_type text not null check (event_type in ('warning', 'suspended', 'resumed')),
  message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists school_lifecycle_events_school_created_idx
  on public.school_lifecycle_events(school_id, created_at desc);

alter table public.school_lifecycle_events enable row level security;

drop policy if exists school_lifecycle_events_platform_read
  on public.school_lifecycle_events;

create policy school_lifecycle_events_platform_read
  on public.school_lifecycle_events
  for select
  to authenticated
  using (schooly_private.is_platform_admin());

create or replace function public.manage_school_lifecycle(
  p_school_id uuid,
  p_action text,
  p_message text default null
) returns jsonb
language plpgsql
security definer
set search_path = public, schooly_private
as $$
declare
  updated_school public.schools;
  normalized_message text := nullif(trim(coalesce(p_message, '')), '');
begin
  if not schooly_private.is_platform_admin() then
    raise exception 'Platform administrator required';
  end if;

  if p_action not in ('suspend', 'resume', 'warn') then
    raise exception 'Unsupported lifecycle action';
  end if;

  if p_action = 'suspend' then
    update public.schools
    set approval_status = 'suspended',
        rejection_reason = coalesce(normalized_message, 'Accès suspendu par la plateforme')
    where id = p_school_id
    returning * into updated_school;

    insert into public.school_lifecycle_events (school_id, event_type, message, created_by)
    values (p_school_id, 'suspended', normalized_message, auth.uid());

  elsif p_action = 'resume' then
    update public.schools
    set approval_status = 'approved',
        rejection_reason = null
    where id = p_school_id
    returning * into updated_school;

    insert into public.school_lifecycle_events (school_id, event_type, message, created_by)
    values (p_school_id, 'resumed', normalized_message, auth.uid());

  else
    select * into updated_school
    from public.schools
    where id = p_school_id;

    insert into public.school_lifecycle_events (school_id, event_type, message, created_by)
    values (p_school_id, 'warning', normalized_message, auth.uid());
  end if;

  if updated_school.id is null then
    raise exception 'School not found';
  end if;

  return jsonb_build_object(
    'id', updated_school.id,
    'status', updated_school.approval_status,
    'event', p_action,
    'data_preserved', true
  );
end;
$$;

revoke all on function public.manage_school_lifecycle(uuid, text, text)
  from public, anon;

grant execute on function public.manage_school_lifecycle(uuid, text, text)
  to authenticated;
