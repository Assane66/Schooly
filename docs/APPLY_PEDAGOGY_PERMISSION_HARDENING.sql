-- Schooly : écriture pédagogique réservée aux rôles autorisés.
-- Les directeurs, administrateurs, enseignants et rôles délégués avec grades.manage restent autorisés.
-- Cette requête ne supprime aucune donnée scolaire.

drop policy if exists subjects_member_access on public.subjects;
drop policy if exists assessments_member_access on public.assessments;
drop policy if exists grades_member_access on public.grades;

create policy subjects_read_approved_member on public.subjects for select to authenticated
  using (schooly_private.is_approved_school_member(school_id));
create policy subjects_create_grades_manager on public.subjects for insert to authenticated
  with check (schooly_private.has_school_permission(school_id, 'grades.manage'));
create policy subjects_update_grades_manager on public.subjects for update to authenticated
  using (schooly_private.has_school_permission(school_id, 'grades.manage'))
  with check (schooly_private.has_school_permission(school_id, 'grades.manage'));
create policy subjects_delete_grades_manager on public.subjects for delete to authenticated
  using (schooly_private.has_school_permission(school_id, 'grades.manage'));

create policy assessments_read_approved_member on public.assessments for select to authenticated
  using (schooly_private.is_approved_school_member(school_id));
create policy assessments_create_grades_manager on public.assessments for insert to authenticated
  with check (schooly_private.has_school_permission(school_id, 'grades.manage'));
create policy assessments_update_grades_manager on public.assessments for update to authenticated
  using (schooly_private.has_school_permission(school_id, 'grades.manage'))
  with check (schooly_private.has_school_permission(school_id, 'grades.manage'));
create policy assessments_delete_grades_manager on public.assessments for delete to authenticated
  using (schooly_private.has_school_permission(school_id, 'grades.manage'));

create policy grades_read_approved_member on public.grades for select to authenticated
  using (schooly_private.is_approved_school_member(school_id));
create policy grades_create_grades_manager on public.grades for insert to authenticated
  with check (schooly_private.has_school_permission(school_id, 'grades.manage'));
create policy grades_update_grades_manager on public.grades for update to authenticated
  using (schooly_private.has_school_permission(school_id, 'grades.manage'))
  with check (schooly_private.has_school_permission(school_id, 'grades.manage'));
create policy grades_delete_grades_manager on public.grades for delete to authenticated
  using (schooly_private.has_school_permission(school_id, 'grades.manage'));
