-- Schooly v1 : primaire, collège et lycée uniquement.
-- Cette requête ne supprime aucune donnée existante.

create or replace function public.enforce_schooly_v1_cycles()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  blocked_pattern text := '(universit|facult|d[ée]partement|semestre|licence|master|doctorat|bachelor|cr[eé]dit)';
begin
  if tg_table_name = 'classes' and concat_ws(' ', new.level_name, new.name) ~* blocked_pattern then
    raise exception 'Schooly v1 supports primary, middle and high school only; university structures are not enabled.';
  end if;

  if tg_table_name = 'schools' and coalesce(new.establishment_type, '') ~* blocked_pattern then
    raise exception 'Schooly v1 does not support university establishment types.';
  end if;

  return new;
end;
$$;

drop trigger if exists schooly_v1_validate_class_cycle on public.classes;
create trigger schooly_v1_validate_class_cycle
before insert or update on public.classes
for each row execute function public.enforce_schooly_v1_cycles();

drop trigger if exists schooly_v1_validate_establishment_type on public.schools;
create trigger schooly_v1_validate_establishment_type
before insert or update on public.schools
for each row execute function public.enforce_schooly_v1_cycles();
