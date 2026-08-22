-- Schooly : accès individuel élève et famille
-- Cette migration n'efface aucune donnée existante.

create table if not exists public.student_portal_invites (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  email text not null,
  relationship text not null check (relationship in ('student','guardian')),
  status text not null default 'pending' check (status in ('pending','accepted','revoked')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (student_id, email, relationship)
);

create table if not exists public.student_portal_links (
  student_id uuid not null references public.students(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  relationship text not null check (relationship in ('student','guardian')),
  created_at timestamptz not null default now(),
  primary key (student_id, user_id, relationship)
);

create index if not exists student_portal_invites_email_idx on public.student_portal_invites (lower(email), status);
create index if not exists student_portal_links_user_idx on public.student_portal_links (user_id, school_id);

alter table public.student_portal_invites enable row level security;
alter table public.student_portal_links enable row level security;

create policy student_portal_invites_manage_leader on public.student_portal_invites for all to authenticated using (schooly_private.can_manage_roles(school_id)) with check (schooly_private.can_manage_roles(school_id));
create policy student_portal_links_read_self on public.student_portal_links for select to authenticated using (user_id = auth.uid() or schooly_private.can_manage_roles(school_id));
create policy student_portal_links_manage_leader on public.student_portal_links for all to authenticated using (schooly_private.can_manage_roles(school_id)) with check (schooly_private.can_manage_roles(school_id));

create or replace function public.claim_student_portal_invites() returns trigger language plpgsql security definer set search_path = public, auth as $$
begin
  insert into public.student_portal_links (student_id, school_id, user_id, relationship)
  select invitation.student_id, invitation.school_id, new.id, invitation.relationship
  from public.student_portal_invites invitation
  where lower(invitation.email) = lower(coalesce(new.email, '')) and invitation.status = 'pending'
  on conflict do nothing;

  insert into public.school_memberships (school_id, user_id, role)
  select distinct invitation.school_id, new.id, case when invitation.relationship = 'student' then 'student' else 'parent' end
  from public.student_portal_invites invitation
  where lower(invitation.email) = lower(coalesce(new.email, '')) and invitation.status = 'pending'
  on conflict (school_id, user_id) do nothing;

  update public.student_portal_invites set status = 'accepted', accepted_at = now()
  where lower(email) = lower(coalesce(new.email, '')) and status = 'pending';
  return new;
end;
$$;

drop trigger if exists schooly_claim_student_portal_invites_after_signup on auth.users;
create trigger schooly_claim_student_portal_invites_after_signup after insert on auth.users for each row execute function public.claim_student_portal_invites();

create or replace function public.get_my_student_portal() returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'relationship', link.relationship,
    'student', jsonb_build_object('id', student.id, 'first_name', student.first_name, 'last_name', student.last_name, 'student_number', student.student_number, 'photo_url', student.photo_url, 'status', student.status),
    'school', jsonb_build_object('id', school.id, 'name', school.name, 'slug', school.slug),
    'payments', coalesce((select jsonb_agg(jsonb_build_object('billing_month', payment.billing_month, 'status', payment.status, 'amount_due', payment.amount_due, 'amount_paid', payment.amount_paid) order by payment.billing_month desc) from public.student_monthly_payment_statuses payment where payment.student_id = student.id), '[]'::jsonb),
    'attendance', coalesce((select jsonb_agg(jsonb_build_object('attendance_date', attendance.attendance_date, 'status', attendance.status) order by attendance.attendance_date desc) from public.attendance_records attendance where attendance.student_id = student.id), '[]'::jsonb)
  )), '[]'::jsonb)
  from public.student_portal_links link
  join public.students student on student.id = link.student_id
  join public.schools school on school.id = link.school_id
  where link.user_id = auth.uid();
$$;

revoke all on function public.get_my_student_portal() from public, anon;
grant execute on function public.get_my_student_portal() to authenticated;
