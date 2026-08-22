-- Schooly : coordonnées professionnelles d’un établissement
-- À exécuter une seule fois dans Supabase > SQL Editor.

alter table public.schools
  add column if not exists address text,
  add column if not exists contact_phone text,
  add column if not exists contact_email text;

create or replace function public.save_school_contact_details(
  p_school_id uuid,
  p_address text,
  p_contact_phone text,
  p_contact_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.school_memberships membership
    where membership.school_id = p_school_id
      and membership.user_id = auth.uid()
      and membership.role = 'owner'
  ) then
    raise exception 'Accès non autorisé aux coordonnées de cet établissement';
  end if;

  update public.schools
  set
    address = nullif(trim(p_address), ''),
    contact_phone = nullif(trim(p_contact_phone), ''),
    contact_email = nullif(lower(trim(p_contact_email)), '')
  where id = p_school_id;
end;
$$;

revoke all on function public.save_school_contact_details(uuid, text, text, text) from public;
grant execute on function public.save_school_contact_details(uuid, text, text, text) to authenticated;
