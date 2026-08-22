import { CheckCircle2, Clock3, Save, UserCheck, UserX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Student = { id: string; first_name: string; last_name: string; student_number: string };
type AttendanceStatus = "present" | "absent" | "late" | "excused";
type AttendanceRecord = { student_id: string; status: AttendanceStatus; note: string | null };

const labels: Record<AttendanceStatus, string> = { present: "Présent", absent: "Absent", late: "Retard", excused: "Excusé" };

export default function Attendance({ schoolId }: { schoolId: string }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: studentData, error: studentError }, { data: recordData, error: recordError }] = await Promise.all([
      supabase.from("students").select("id, first_name, last_name, student_number").eq("school_id", schoolId).eq("status", "active").order("last_name"),
      supabase.from("attendance_records").select("student_id, status, note").eq("school_id", schoolId).eq("attendance_date", date),
    ]);
    if (studentError || recordError) toast.error("Impossible de charger la feuille de présence", { description: studentError?.message ?? recordError?.message });
    setStudents((studentData ?? []) as Student[]);
    const entries = (recordData ?? []) as AttendanceRecord[];
    setRecords(Object.fromEntries(entries.map((record) => [record.student_id, record.status])));
    setNotes(Object.fromEntries(entries.map((record) => [record.student_id, record.note ?? ""])));
    setLoading(false);
  };

  useEffect(() => { void load(); }, [schoolId, date]);

  const counts = useMemo(() => students.reduce<Record<AttendanceStatus, number>>((current, student) => { const status = records[student.id]; if (status) current[status] += 1; return current; }, { present: 0, absent: 0, late: 0, excused: 0 }), [students, records]);

  const save = async () => {
    if (!students.length) return;
    const { data: { user } } = await supabase.auth.getUser();
    const payload = students.map((student) => ({ school_id: schoolId, student_id: student.id, attendance_date: date, status: records[student.id] ?? "present", note: notes[student.id]?.trim() || null, recorded_by: user?.id ?? null }));
    setSaving(true);
    const { error } = await supabase.from("attendance_records").upsert(payload, { onConflict: "student_id,attendance_date" });
    setSaving(false);
    if (error) { toast.error("La présence n’a pas été enregistrée", { description: error.message }); return; }
    toast.success(`Présence enregistrée pour ${students.length} élève(s).`); await load();
  };

  return <><div className="module-header"><div><p className="eyebrow">VIE SCOLAIRE</p><h1>Présences quotidiennes</h1></div><button className="primary-button" onClick={() => void save()} disabled={saving || !students.length}><Save size={16} /> {saving ? "Enregistrement…" : "Enregistrer la feuille"}</button></div>
    <section className="attendance-summary"><article><span><UserCheck size={19} /></span><div><p>Présents</p><strong>{counts.present}</strong></div></article><article><span><UserX size={19} /></span><div><p>Absents</p><strong>{counts.absent}</strong></div></article><article><span><Clock3 size={19} /></span><div><p>Retards</p><strong>{counts.late}</strong></div></article><article><span><CheckCircle2 size={19} /></span><div><p>Relevés</p><strong>{Object.keys(records).length} / {students.length}</strong></div></article></section>
    <section className="panel attendance-sheet"><div className="attendance-sheet-toolbar"><div><p className="eyebrow">FEUILLE DU JOUR</p><h2>Statut de chaque élève</h2></div><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label></div><p className="attendance-sheet-hint">Une feuille non renseignée reste modifiable. Lors de l’enregistrement, les élèves sans statut sélectionné sont marqués présents.</p><div className="attendance-sheet-table"><div className="attendance-sheet-head"><span>ÉLÈVE</span><span>MATRICULE</span><span>STATUT</span><span>NOTE</span></div>{students.map((student) => <div className="attendance-sheet-row" key={student.id}><strong>{student.first_name} {student.last_name}</strong><span>{student.student_number}</span><select value={records[student.id] ?? "present"} onChange={(event) => setRecords((current) => ({ ...current, [student.id]: event.target.value as AttendanceStatus }))}>{(Object.keys(labels) as AttendanceStatus[]).map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select><input value={notes[student.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [student.id]: event.target.value }))} placeholder="Facultatif" /></div>)}{!students.length && <div className="empty-search">{loading ? "Chargement de la liste…" : "Ajoutez des élèves actifs avant de relever les présences."}</div>}</div></section>
  </>;
}
