import { BookOpenCheck, ClipboardCheck, Plus, Printer, Save, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Subject = { id: string; name: string; code: string | null };
type Student = { id: string; first_name: string; last_name: string; student_number: string };
type Assessment = { id: string; title: string; assessment_date: string; maximum_score: number; subject_id: string | null };
type Grade = { student_id: string; score: number; comment: string | null };
type ReportGrade = { score: number; assessment: Assessment | null };

export default function Pedagogy({ schoolId }: { schoolId: string }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [assessmentSubjectId, setAssessmentSubjectId] = useState("");
  const [maximumScore, setMaximumScore] = useState("20");
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingGrades, setSavingGrades] = useState(false);
  const [draftScores, setDraftScores] = useState<Record<string, string>>({});
  const [reportStudentId, setReportStudentId] = useState("");
  const [reportGrades, setReportGrades] = useState<ReportGrade[]>([]);

  const selectedAssessment = assessments.find((assessment) => assessment.id === selectedAssessmentId) ?? null;
  const subjectById = useMemo(() => new Map(subjects.map((subject) => [subject.id, subject])), [subjects]);
  const average = grades.length ? grades.reduce((total, grade) => total + Number(grade.score), 0) / grades.length : null;
  const reportStudent = students.find((student) => student.id === reportStudentId) ?? null;
  const reportAveragePercentage = reportGrades.length ? reportGrades.reduce((total, grade) => total + (Number(grade.score) / Number(grade.assessment?.maximum_score || 20)) * 100, 0) / reportGrades.length : null;

  const load = async () => {
    const [{ data: subjectData }, { data: studentData }, { data: assessmentData }] = await Promise.all([
      supabase.from("subjects").select("id, name, code").eq("school_id", schoolId).order("name"),
      supabase.from("students").select("id, first_name, last_name, student_number").eq("school_id", schoolId).eq("status", "active").order("last_name"),
      supabase.from("assessments").select("id, title, assessment_date, maximum_score, subject_id").eq("school_id", schoolId).order("assessment_date", { ascending: false }),
    ]);
    setSubjects((subjectData ?? []) as Subject[]);
    setStudents((studentData ?? []) as Student[]);
    setAssessments((assessmentData ?? []) as Assessment[]);
  };

  useEffect(() => { void load(); }, [schoolId]);

  useEffect(() => {
    if (!selectedAssessmentId) { setGrades([]); setDraftScores({}); return; }
    void (async () => {
      const { data, error } = await supabase.from("grades").select("student_id, score, comment").eq("assessment_id", selectedAssessmentId);
      if (error) { toast.error("Impossible de charger les notes", { description: error.message }); return; }
      const current = (data ?? []) as Grade[];
      setGrades(current);
      setDraftScores(Object.fromEntries(current.map((grade) => [grade.student_id, String(grade.score)])));
    })();
  }, [selectedAssessmentId]);

  useEffect(() => {
    if (!reportStudentId) { setReportGrades([]); return; }
    void (async () => {
      const { data, error } = await supabase.from("grades").select("score, assessment:assessments(title, assessment_date, maximum_score, subject_id)").eq("school_id", schoolId).eq("student_id", reportStudentId);
      if (error) { toast.error("Impossible de charger le relevé", { description: error.message }); return; }
      setReportGrades((data ?? []) as unknown as ReportGrade[]);
    })();
  }, [reportStudentId, schoolId]);

  const createSubject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    const { data, error } = await supabase.from("subjects").insert({ school_id: schoolId, name: subjectName.trim(), code: subjectCode.trim() || null }).select("id, name, code").single();
    setSaving(false);
    if (error || !data) { toast.error("La matière n’a pas été créée", { description: error?.message }); return; }
    setSubjects((current) => [...current, data as Subject].sort((a, b) => a.name.localeCompare(b.name)));
    setAssessmentSubjectId(data.id); setSubjectName(""); setSubjectCode(""); setShowSubjectForm(false); toast.success("Matière ajoutée");
  };

  const createAssessment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    const { data, error } = await supabase.from("assessments").insert({ school_id: schoolId, title: assessmentTitle.trim(), subject_id: assessmentSubjectId || null, assessment_date: assessmentDate, maximum_score: Number(maximumScore) }).select("id, title, assessment_date, maximum_score, subject_id").single();
    setSaving(false);
    if (error || !data) { toast.error("L’évaluation n’a pas été créée", { description: error?.message }); return; }
    setAssessments((current) => [data as Assessment, ...current]); setSelectedAssessmentId(data.id); setAssessmentTitle(""); setShowAssessmentForm(false); toast.success("Évaluation créée : saisissez maintenant les notes.");
  };

  const saveGrades = async () => {
    if (!selectedAssessment) return;
    const prepared = students.flatMap((student) => {
      const raw = draftScores[student.id];
      if (raw === undefined || raw.trim() === "") return [];
      const score = Number(raw.replace(",", "."));
      if (!Number.isFinite(score) || score < 0 || score > Number(selectedAssessment.maximum_score)) return [];
      return [{ school_id: schoolId, assessment_id: selectedAssessment.id, student_id: student.id, score }];
    });
    const invalidCount = Object.entries(draftScores).filter(([studentId, raw]) => raw.trim() && (!Number.isFinite(Number(raw.replace(",", "."))) || Number(raw.replace(",", ".")) < 0 || Number(raw.replace(",", ".")) > Number(selectedAssessment.maximum_score)) && students.some((student) => student.id === studentId)).length;
    if (invalidCount) { toast.error("Certaines notes sont invalides", { description: `Utilisez une valeur entre 0 et ${selectedAssessment.maximum_score}.` }); return; }
    setSavingGrades(true);
    const { error } = await supabase.from("grades").upsert(prepared, { onConflict: "assessment_id,student_id" });
    setSavingGrades(false);
    if (error) { toast.error("Les notes n’ont pas été enregistrées", { description: error.message }); return; }
    const { data } = await supabase.from("grades").select("student_id, score, comment").eq("assessment_id", selectedAssessment.id);
    setGrades((data ?? []) as Grade[]); toast.success(`${prepared.length} note(s) enregistrée(s).`);
  };

  const printReport = () => {
    if (!reportStudent) return;
    const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
    const reportRows = reportGrades.map((grade) => `<tr><td>${escapeHtml(grade.assessment?.title ?? "Évaluation")}</td><td>${escapeHtml(grade.assessment?.subject_id ? subjectById.get(grade.assessment.subject_id)?.name ?? "—" : "—")}</td><td>${new Date(grade.assessment?.assessment_date ?? Date.now()).toLocaleDateString("fr-FR")}</td><td>${Number(grade.score).toLocaleString("fr-FR")} / ${grade.assessment?.maximum_score ?? 20}</td></tr>`).join("");
    const page = window.open("", "_blank", "noopener,noreferrer");
    if (!page) { toast.error("L’impression a été bloquée", { description: "Autorisez les fenêtres contextuelles puis réessayez." }); return; }
    page.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8" /><title>Relevé — ${escapeHtml(`${reportStudent.first_name} ${reportStudent.last_name}`)}</title><style>body{font-family:Arial,sans-serif;color:#17315e;padding:42px}h1{margin:0 0 5px}p{color:#66758c}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{text-align:left;padding:11px;border-bottom:1px solid #dce4f4;font-size:13px}th{color:#62738b;font-size:11px;text-transform:uppercase}footer{margin-top:32px;color:#71809a;font-size:11px}</style></head><body><p>SCHOOLY · RELEVÉ INDIVIDUEL</p><h1>${escapeHtml(`${reportStudent.first_name} ${reportStudent.last_name}`)}</h1><p>Matricule : ${escapeHtml(reportStudent.student_number)} · Moyenne normalisée : ${reportAveragePercentage === null ? "—" : `${reportAveragePercentage.toFixed(1)} %`}</p><table><thead><tr><th>Évaluation</th><th>Matière</th><th>Date</th><th>Résultat</th></tr></thead><tbody>${reportRows || "<tr><td colspan='4'>Aucune note enregistrée.</td></tr>"}</tbody></table><footer>Document généré depuis Schooly le ${new Date().toLocaleDateString("fr-FR")}</footer><script>window.print();</script></body></html>`);
    page.document.close();
  };

  return <><div className="module-header"><div><p className="eyebrow">REGISTRE PÉDAGOGIQUE</p><h1>Pédagogie & résultats</h1></div><div className="module-header-actions"><button className="soft-button" onClick={() => setShowSubjectForm(true)}><Plus size={16} /> Matière</button><button className="primary-button" onClick={() => setShowAssessmentForm(true)}><Plus size={16} /> Évaluation</button></div></div>
    <section className="pedagogy-summary"><article><span><BookOpenCheck size={19} /></span><div><p>Matières</p><strong>{subjects.length}</strong></div></article><article><span><ClipboardCheck size={19} /></span><div><p>Évaluations</p><strong>{assessments.length}</strong></div></article><article><span><Sparkles size={19} /></span><div><p>Moyenne sélectionnée</p><strong>{average === null || !selectedAssessment ? "—" : `${average.toFixed(2)} / ${selectedAssessment.maximum_score}`}</strong></div></article></section>
    {showSubjectForm && <section className="student-create-panel pedagogy-form"><div><p className="eyebrow">NOUVELLE MATIÈRE</p><h2>Structurer l’enseignement</h2><p>Ajoutez les matières utilisées par votre établissement.</p></div><form onSubmit={createSubject}><label>Nom<input value={subjectName} onChange={(event) => setSubjectName(event.target.value)} placeholder="Ex. Mathématiques" required /></label><label>Code facultatif<input value={subjectCode} onChange={(event) => setSubjectCode(event.target.value)} placeholder="Ex. MATH" /></label><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowSubjectForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Création…" : "Créer la matière"}</button></div></form></section>}
    {showAssessmentForm && <section className="student-create-panel pedagogy-form"><div><p className="eyebrow">NOUVELLE ÉVALUATION</p><h2>Préparer une saisie de notes</h2><p>Chaque évaluation dispose de son barème et de sa liste de notes.</p></div><form onSubmit={createAssessment}><label>Intitulé<input value={assessmentTitle} onChange={(event) => setAssessmentTitle(event.target.value)} placeholder="Ex. Contrôle 1" required /></label><label>Matière<select value={assessmentSubjectId} onChange={(event) => setAssessmentSubjectId(event.target.value)}><option value="">Non précisée</option>{subjects.map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}</select></label><div className="pedagogy-form-row"><label>Date<input type="date" value={assessmentDate} onChange={(event) => setAssessmentDate(event.target.value)} required /></label><label>Barème<input type="number" min="1" step="0.5" value={maximumScore} onChange={(event) => setMaximumScore(event.target.value)} required /></label></div><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowAssessmentForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Création…" : "Créer l’évaluation"}</button></div></form></section>}
    <section className="pedagogy-grid"><section className="panel pedagogy-assessment-list"><div className="panel-heading"><div><p className="eyebrow">ÉVALUATIONS</p><h2>Registre récent</h2></div></div>{assessments.length ? assessments.map((assessment) => <button className={`pedagogy-assessment-row ${selectedAssessmentId === assessment.id ? "selected" : ""}`} onClick={() => setSelectedAssessmentId(assessment.id)} key={assessment.id}><span>{assessment.title.charAt(0).toUpperCase()}</span><div><strong>{assessment.title}</strong><small>{assessment.subject_id ? subjectById.get(assessment.subject_id)?.name ?? "Matière" : "Matière non précisée"} · {new Date(assessment.assessment_date).toLocaleDateString("fr-FR")}</small></div><em>/ {assessment.maximum_score}</em></button>) : <div className="empty-search">Aucune évaluation. Commencez par créer une matière ou une évaluation.</div>}</section>
      <section className="panel gradebook-panel"><div className="panel-heading"><div><p className="eyebrow">SAISIE DES NOTES</p><h2>{selectedAssessment ? selectedAssessment.title : "Choisissez une évaluation"}</h2></div>{selectedAssessment && <button className="primary-button" disabled={savingGrades} onClick={() => void saveGrades()}><Save size={16} /> {savingGrades ? "Enregistrement…" : "Enregistrer"}</button>}</div>{selectedAssessment ? <><p className="gradebook-hint">Barème : <strong>{selectedAssessment.maximum_score}</strong>. Les champs vides ne modifient pas les notes existantes.</p><div className="gradebook-table"><div><span>ÉLÈVE</span><span>MATRICULE</span><span>NOTE</span></div>{students.map((student) => <div key={student.id}><strong>{student.first_name} {student.last_name}</strong><span>{student.student_number}</span><label><input value={draftScores[student.id] ?? ""} onChange={(event) => setDraftScores((current) => ({ ...current, [student.id]: event.target.value }))} inputMode="decimal" placeholder={`0–${selectedAssessment.maximum_score}`} aria-label={`Note de ${student.first_name} ${student.last_name}`} /><em>/ {selectedAssessment.maximum_score}</em></label></div>)}{!students.length && <div className="empty-search">Ajoutez des élèves avant de saisir des notes.</div>}</div></> : <div className="empty-search">Sélectionnez une évaluation dans la colonne de gauche pour ouvrir le registre de notes.</div>}</section></section>
    <section className="panel student-report-panel"><div><p className="eyebrow">RELEVÉ INDIVIDUEL</p><h2>Imprimer les résultats d’un élève</h2><p>Le relevé regroupe les évaluations saisies et une moyenne normalisée sur 100.</p></div><select value={reportStudentId} onChange={(event) => setReportStudentId(event.target.value)}><option value="">Choisir un élève</option>{students.map((student) => <option key={student.id} value={student.id}>{student.first_name} {student.last_name} · {student.student_number}</option>)}</select><div>{reportStudent && <><strong>{reportGrades.length} évaluation(s) · {reportAveragePercentage === null ? "Aucune moyenne" : `${reportAveragePercentage.toFixed(1)} %`}</strong><button className="outline-button" onClick={printReport}><Printer size={16} /> Imprimer le relevé</button></>}</div></section>
  </>;
}
