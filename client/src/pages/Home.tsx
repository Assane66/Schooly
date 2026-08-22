/**
 * Design Campus Graphique — poste de pilotage éditorial : ivoire chaleureux,
 * bleu nuit structurant et cobalt #2B59FF comme repère d’action.
 */
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { hasPlatformAdminRole, supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { useLocation } from "wouter";
import Registrations from "./Registrations";
import Payments from "./Payments";
import Roles from "./Roles";

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [{ label: "Vue d’ensemble", icon: LayoutDashboard }],
  },
  {
    label: "GESTION SCOLAIRE",
    items: [
      { label: "Élèves", icon: UsersRound },
      { label: "Inscriptions", icon: FileText },
      { label: "Classes", icon: GraduationCap },
      { label: "Pédagogie", icon: BookOpenCheck },
      { label: "Vie scolaire", icon: UserCheck, badge: "3" },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { label: "Finances", icon: WalletCards },
      { label: "Documents", icon: FileText },
      { label: "Calendrier", icon: CalendarDays },
      { label: "Équipe & rôles", icon: ShieldCheck },
    ],
  },
];

type SchoolyStudent = {
  id: string;
  student_number: string;
  first_name: string;
  last_name: string;
  status: "active" | "inactive" | "graduated" | "withdrawn";
  photo_url: string | null;
};

type SchoolyAcademicYear = {
  id: string;
  label: string;
  starts_on: string;
  ends_on: string;
  is_current: boolean;
};

type SchoolyClass = {
  id: string;
  academic_year_id: string;
  level_name: string;
  name: string;
  capacity: number | null;
};

type DashboardStats = {
  attendance: number;
  payments: number;
  upcomingEvents: number;
};

const activity = [
  { title: "Présences finalisées", text: "M. Diallo · 4e B", time: "Il y a 12 min", icon: UserCheck, tone: "green" },
  { title: "Paiement enregistré", text: "M. Ba · Échéance août", time: "Il y a 36 min", icon: WalletCards, tone: "blue" },
  { title: "Note publiée", text: "Mathématiques · 3e C", time: "Il y a 1 h", icon: BookOpenCheck, tone: "orange" },
];

const classes = [
  ["6e A", "32", "40", "Mme Ndao"],
  ["6e B", "29", "40", "M. Faye"],
  ["5e A", "35", "40", "Mme Sow"],
  ["4e B", "31", "35", "M. Diallo"],
];

function InitialAvatar({ initials, className = "" }: { initials: string; className?: string }) {
  return <span className={`initial-avatar ${className}`}>{initials}</span>;
}

function ModuleHeader({ title, eyebrow, action, onAction }: { title: string; eyebrow: string; action: string; onAction: () => void }) {
  return (
    <div className="module-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <button className="primary-button" onClick={onAction}>
        <Plus size={17} /> {action}
      </button>
    </div>
  );
}

function Dashboard({ schoolId, schoolName, studentCount, stats, onAction }: { schoolId: string; schoolName: string; studentCount: number; stats: DashboardStats; onAction: (name: string) => void }) {
  const [attendanceDetails, setAttendanceDetails] = useState<Array<{ status: string }>>([]);
  const [recentAssessments, setRecentAssessments] = useState<Array<{ id: string; title: string; assessment_date: string }>>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ id: string; title: string; starts_at: string; description: string | null }>>([]);
  useEffect(() => { if (!schoolId) return; void (async () => { const today = new Date().toISOString().slice(0, 10); const [{ data: attendance }, { data: assessments }, { data: events }] = await Promise.all([supabase.from("attendance_records").select("status").eq("school_id", schoolId).eq("attendance_date", today), supabase.from("assessments").select("id, title, assessment_date").eq("school_id", schoolId).order("assessment_date", { ascending: false }).limit(3), supabase.from("calendar_events").select("id, title, starts_at, description").eq("school_id", schoolId).gte("starts_at", new Date().toISOString()).order("starts_at").limit(3)]); setAttendanceDetails(attendance ?? []); setRecentAssessments(assessments ?? []); setUpcomingEvents(events ?? []); })(); }, [schoolId]);
  const presentCount = attendanceDetails.filter((record) => record.status === "present").length;
  const absentCount = attendanceDetails.filter((record) => record.status === "absent" || record.status === "excused").length;
  const lateCount = attendanceDetails.filter((record) => record.status === "late").length;
  const attendanceRate = attendanceDetails.length ? Math.round((presentCount / attendanceDetails.length) * 100) : null;
  const nextEvent = upcomingEvents[0];
  return (
    <>
      <section className="morning-brief">
        <div className="brief-copy">
          <div className="brief-label"><span /> MERCREDI 21 AOÛT</div>
          <h1>La journée est structurée.<br /><em>Passons aux priorités.</em></h1>
          <p>Voici une vue d’ensemble de {schoolName}. Les indicateurs s’enrichiront à mesure que votre équipe utilise Schooly.</p>
          <button className="brief-button" onClick={() => onAction("Ajouter un élève")}>
            <Plus size={17} /> Ajouter un élève
          </button>
        </div>
        <div className="brief-image" aria-label="Illustration de campus Schooly" />
        <div className="brief-stamp"><GraduationCap size={18} /><span>Espace<br />Schooly</span></div>
      </section>

      <section className="metrics-grid" aria-label="Indicateurs de l’établissement">
        <article className="metric-card metric-card--blue">
          <div className="metric-icon"><UsersRound size={20} /></div>
          <p>Élèves inscrits</p>
          <strong>{studentCount}</strong>
          <span className="metric-trend">Connecté <small>à votre liste d’élèves</small></span>
        </article>
        <article className="metric-card">
          <div className="metric-icon metric-icon--orange"><UserCheck size={20} /></div>
          <p>Présence aujourd’hui</p>
          <strong>{stats.attendance}</strong>
          <div className="tiny-progress"><i style={{ width: stats.attendance ? "100%" : "0%" }} /></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon metric-icon--green"><WalletCards size={20} /></div>
          <p>Encaissements du mois</p>
          <strong>{stats.payments}</strong>
          <span className="metric-trend metric-trend--dark">Paiements <small>enregistrés ce mois-ci</small></span>
        </article>
        <article className="metric-card metric-card--alert">
          <div className="metric-icon metric-icon--coral"><Bell size={20} /></div>
          <p>Points à suivre</p>
          <strong>{stats.upcomingEvents}</strong>
          <button className="metric-link" onClick={() => onAction("Ouvrir les points à suivre")}>Événements à venir <ArrowUpRight size={15} /></button>
        </article>
      </section>

      <section className="dashboard-columns">
        <div className="dashboard-main-column">
          <article className="panel attendance-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">VIE SCOLAIRE</p>
                <h2>Présences du jour</h2>
              </div>
              <button className="text-button" onClick={() => onAction("Consulter toutes les présences")}>Voir le suivi <ChevronRight size={16} /></button>
            </div>
            <div className="attendance-layout">
              <div className="attendance-figure">
                <div className="ring"><div><strong>{attendanceRate ?? "—"}</strong>{attendanceRate !== null && <span>%</span>}</div></div>
                <p>{attendanceRate === null ? "aucun relevé" : "présence globale"}</p>
              </div>
              <div className="attendance-breakdown">
                <div><span className="dot dot--green" /> Présents <strong>{presentCount}</strong><i><b style={{ width: attendanceDetails.length ? `${Math.round((presentCount / attendanceDetails.length) * 100)}%` : "0%" }} /></i></div>
                <div><span className="dot dot--coral" /> Absents <strong>{absentCount}</strong><i><b style={{ width: attendanceDetails.length ? `${Math.round((absentCount / attendanceDetails.length) * 100)}%` : "0%" }} /></i></div>
                <div><span className="dot dot--orange" /> Retards <strong>{lateCount}</strong><i><b style={{ width: attendanceDetails.length ? `${Math.round((lateCount / attendanceDetails.length) * 100)}%` : "0%" }} /></i></div>
              </div>
              <button className="square-action" aria-label="Gérer les présences" onClick={() => onAction("Gérer les présences")}><ChevronRight size={20} /></button>
            </div>
          </article>

          <article className="panel academic-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">PÉDAGOGIE</p>
                <h2>Évaluations à compléter</h2>
              </div>
              <button className="text-button" onClick={() => onAction("Accéder aux évaluations")}>Toutes les évaluations <ChevronRight size={16} /></button>
            </div>
            <div className="assessment-list">
              {recentAssessments.map((assessment, index) => <div className="assessment-row" key={assessment.id}><span className={`subject-pill ${index % 2 ? "subject-pill--orange" : "subject-pill--blue"}`}>{assessment.title.charAt(0).toUpperCase()}</span><div><strong>{assessment.title}</strong><p>Évaluation du {new Date(assessment.assessment_date).toLocaleDateString("fr-FR")}</p></div><span className="due-pill due-pill--soft">À compléter</span><button onClick={() => onAction(`Ouvrir ${assessment.title}`)}><ChevronRight size={18} /></button></div>)}
              {!recentAssessments.length && <div className="empty-search"><strong>Aucune évaluation n’est encore enregistrée.</strong><span>Créez la première depuis le module Pédagogie.</span></div>}
            </div>
          </article>
        </div>

        <aside className="dashboard-side-column">
          <article className="panel agenda-panel">
            <div className="panel-heading compact">
              <div><p className="eyebrow">À VENIR</p><h2>Mon agenda</h2></div>
              <button className="icon-button" aria-label="Voir le calendrier" onClick={() => onAction("Ouvrir le calendrier")}><CalendarDays size={18} /></button>
            </div>
            {nextEvent ? <><div className="agenda-date"><span>{new Date(nextEvent.starts_at).getDate()}</span><div><strong>{new Date(nextEvent.starts_at).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()}</strong><p>{new Date(nextEvent.starts_at).toLocaleDateString("fr-FR", { weekday: "long" })}</p></div></div>{upcomingEvents.map((event, index) => <div className="agenda-entry" key={event.id}><i className={`agenda-pin ${index % 2 ? "agenda-pin--orange" : "agenda-pin--blue"}`} /><div><strong>{event.title}</strong><p>{new Date(event.starts_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}{event.description ? ` · ${event.description}` : ""}</p></div></div>)}</> : <div className="empty-search"><strong>Aucun événement à venir.</strong><span>Ajoutez-en un depuis le module Calendrier.</span></div>}
            <button className="outline-button" onClick={() => onAction("Ajouter un événement")}>Ajouter un événement <Plus size={16} /></button>
          </article>

          <article className="panel activity-panel">
            <div className="panel-heading compact"><div><p className="eyebrow">EN DIRECT</p><h2>Activité récente</h2></div><button className="icon-button" aria-label="Options"><MoreHorizontal size={19} /></button></div>
            <div className="activity-list">{recentAssessments.map((assessment) => <div className="activity-item" key={assessment.id}><span className="activity-icon activity-icon--blue"><BookOpenCheck size={15} /></span><div><strong>Évaluation enregistrée</strong><p>{assessment.title}</p><time>{new Date(assessment.assessment_date).toLocaleDateString("fr-FR")}</time></div></div>)}{!recentAssessments.length && <div className="empty-search"><strong>Aucune activité récente.</strong><span>Les opérations de votre établissement apparaîtront ici.</span></div>}</div>
          </article>
        </aside>
      </section>
    </>
  );
}

function StudentsPage({ schoolId, onAction }: { schoolId: string; onAction: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<SchoolyStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const uploadSignature = trpc.media.createUploadSignature.useMutation();
  const loadStudents = async () => { setLoading(true); const { data, error } = await supabase.from("students").select("id, student_number, first_name, last_name, status, photo_url").eq("school_id", schoolId).order("last_name"); if (error) { toast.error("Impossible de charger les élèves", { description: error.message }); } else { setStudents((data ?? []) as SchoolyStudent[]); } setLoading(false); };
  useEffect(() => { void loadStudents(); }, [schoolId]);
  const visibleStudents = useMemo(() => students.filter((student) => `${student.first_name} ${student.last_name}`.toLowerCase().includes(query.toLowerCase()) || student.student_number.toLowerCase().includes(query.toLowerCase())), [query, students]);
  const createStudent = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); const studentNumber = `ELV-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 7).toUpperCase()}`; const { data, error } = await supabase.from("students").insert({ school_id: schoolId, student_number: studentNumber, first_name: firstName.trim(), last_name: lastName.trim(), status: "active" }).select("id, student_number, first_name, last_name, status, photo_url").single(); if (error || !data) { setSaving(false); toast.error("L’élève n’a pas été créé", { description: error?.message }); return; } let createdStudent = data as SchoolyStudent; if (photoFile) { try { const signed = await uploadSignature.mutateAsync({ schoolId, kind: "student-photo" }); const payload = new FormData(); payload.append("file", photoFile); payload.append("api_key", signed.apiKey); payload.append("timestamp", String(signed.timestamp)); payload.append("folder", signed.folder); payload.append("signature", signed.signature); const uploadResponse = await fetch(signed.endpoint, { method: "POST", body: payload }); const upload = await uploadResponse.json() as { secure_url?: string; public_id?: string; bytes?: number }; if (!uploadResponse.ok || !upload.secure_url || !upload.public_id) throw new Error("La photo n’a pas pu être envoyée."); const { data: updated, error: updateError } = await supabase.from("students").update({ photo_url: upload.secure_url, photo_cloudinary_public_id: upload.public_id }).eq("id", data.id).select("id, student_number, first_name, last_name, status, photo_url").single(); if (updateError || !updated) throw updateError ?? new Error("La photo n’a pas pu être enregistrée."); createdStudent = updated as SchoolyStudent; await supabase.from("media_assets").insert({ school_id: schoolId, owner_id: (await supabase.auth.getUser()).data.user?.id ?? null, kind: "student_photo", cloudinary_public_id: upload.public_id, delivery_url: upload.secure_url, mime_type: photoFile.type, bytes: upload.bytes ?? null }); } catch (uploadError) { toast.error("Élève créé sans photo", { description: uploadError instanceof Error ? uploadError.message : "Le transfert média a échoué." }); } } setSaving(false); setStudents((current) => [createdStudent, ...current]); setFirstName(""); setLastName(""); setPhotoFile(null); setShowForm(false); toast.success("Élève ajouté", { description: `${firstName} ${lastName} est maintenant dans votre établissement.` }); };
  return (
    <>
      <ModuleHeader eyebrow="GESTION SCOLAIRE" title="Élèves" action="Nouvel élève" onAction={() => setShowForm(true)} />
      <section className="module-summary-strip">
        <div><span>{students.length}</span><p>élèves enregistrés</p></div><div><span>{students.filter((student) => student.status === "active").length}</span><p>dossiers actifs</p></div><div><span>0</span><p>inscriptions à valider</p></div>
        <button className="soft-button" onClick={() => onAction("Importer un fichier d’élèves")}>Importer CSV / Excel <ArrowUpRight size={16} /></button>
      </section>
      {showForm && <section className="student-create-panel"><div><p className="eyebrow">NOUVEAU DOSSIER</p><h2>Ajouter un élève</h2><p>Le matricule sera généré automatiquement pour votre établissement.</p></div><form onSubmit={createStudent}><label>Prénom<input value={firstName} onChange={(event) => setFirstName(event.target.value)} required placeholder="Ex. Aïssatou" /></label><label>Nom<input value={lastName} onChange={(event) => setLastName(event.target.value)} required placeholder="Ex. Ndiaye" /></label><label className="student-photo-input">Photo <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)} /><small>{photoFile ? photoFile.name : "Optionnel · PNG, JPEG ou WebP"}</small></label><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Ajout…" : "Créer l’élève"} <ArrowRight size={16} /></button></div></form></section>}
      <section className="panel data-panel">
        <div className="data-toolbar"><div className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un élève ou un matricule" /></div><button className="filter-button" onClick={() => onAction("Ouvrir les filtres")}><Settings size={16} /> Filtres</button></div>
        <div className="student-table" role="table">
          <div className="table-head" role="row"><span>ÉLÈVE</span><span>MATRICULE</span><span>CLASSE</span><span>STATUT</span><span /></div>
          {visibleStudents.map((student) => { const name = `${student.first_name} ${student.last_name}`; return <div className="table-row" role="row" key={student.id}><div className="student-cell">{student.photo_url ? <img src={student.photo_url} alt="" /> : <InitialAvatar initials={`${student.first_name[0] ?? ""}${student.last_name[0] ?? ""}`} />}<strong>{name}</strong></div><span className="id-code">{student.student_number}</span><span>—</span><span className={`status-chip ${student.status === "active" ? "status-chip--good" : "status-chip--watch"}`}>{student.status === "active" ? "Actif" : student.status}</span><button aria-label={`Voir ${name}`} onClick={() => onAction(`Ouvrir la fiche de ${name}`)}><ChevronRight size={19} /></button></div>; })}
          {!visibleStudents.length && <div className="empty-search">{loading ? "Chargement des élèves…" : query ? "Aucun élève ne correspond à votre recherche." : <><strong>Votre liste est prête à accueillir son premier élève.</strong><button className="text-button" onClick={() => setShowForm(true)}>Créer le premier dossier <ChevronRight size={16} /></button></>}</div>}
        </div>
      </section>
    </>
  );
}

function ClassesPage({ schoolId, onAction }: { schoolId: string; onAction: (name: string) => void }) {
  const [years, setYears] = useState<SchoolyAcademicYear[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolyClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showYearForm, setShowYearForm] = useState(false);
  const [showClassForm, setShowClassForm] = useState(false);
  const [yearLabel, setYearLabel] = useState("2026–2027");
  const [yearStart, setYearStart] = useState("2026-09-01");
  const [yearEnd, setYearEnd] = useState("2027-07-31");
  const [levelName, setLevelName] = useState("");
  const [className, setClassName] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [saving, setSaving] = useState(false);
  const activeYear = years.find((year) => year.is_current) ?? years[0];
  const displayedClasses = activeYear ? schoolClasses.filter((schoolClass) => schoolClass.academic_year_id === activeYear.id) : [];
  const totalCapacity = displayedClasses.reduce((total, schoolClass) => total + (schoolClass.capacity ?? 0), 0);
  const loadClasses = async () => { setLoading(true); const [{ data: yearData, error: yearError }, { data: classData, error: classError }] = await Promise.all([supabase.from("academic_years").select("id, label, starts_on, ends_on, is_current").eq("school_id", schoolId).order("starts_on", { ascending: false }), supabase.from("classes").select("id, academic_year_id, level_name, name, capacity").eq("school_id", schoolId).order("level_name").order("name")]); if (yearError || classError) toast.error("Impossible de charger les classes", { description: yearError?.message ?? classError?.message }); setYears((yearData ?? []) as SchoolyAcademicYear[]); setSchoolClasses((classData ?? []) as SchoolyClass[]); setLoading(false); };
  useEffect(() => { void loadClasses(); }, [schoolId]);
  const createYear = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); const { data, error } = await supabase.from("academic_years").insert({ school_id: schoolId, label: yearLabel.trim(), starts_on: yearStart, ends_on: yearEnd, is_current: true }).select("id, label, starts_on, ends_on, is_current").single(); setSaving(false); if (error || !data) { toast.error("L’année scolaire n’a pas été créée", { description: error?.message }); return; } setYears((current) => [data as SchoolyAcademicYear, ...current]); setShowYearForm(false); toast.success("Année scolaire créée", { description: `${data.label} devient votre année active.` }); };
  const createClass = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!activeYear) return; setSaving(true); const { data, error } = await supabase.from("classes").insert({ school_id: schoolId, academic_year_id: activeYear.id, level_name: levelName.trim(), name: className.trim(), capacity: Number(capacity) || null }).select("id, academic_year_id, level_name, name, capacity").single(); setSaving(false); if (error || !data) { toast.error("La classe n’a pas été créée", { description: error?.message }); return; } setSchoolClasses((current) => [...current, data as SchoolyClass]); setLevelName(""); setClassName(""); setCapacity("30"); setShowClassForm(false); toast.success("Classe créée", { description: `${data.name} est disponible pour les inscriptions.` }); };
  return <><ModuleHeader eyebrow="GESTION SCOLAIRE" title="Classes & niveaux" action={activeYear ? "Créer une classe" : "Créer une année"} onAction={() => activeYear ? setShowClassForm(true) : setShowYearForm(true)} />
    <section className="class-cards"><article><span className="class-card-icon"><GraduationCap size={21} /></span><p>Capacité déclarée</p><strong>{totalCapacity || "—"}</strong><em>Pour l’année active</em></article><article><span className="class-card-icon class-card-icon--orange"><BookOpenCheck size={21} /></span><p>Classes créées</p><strong>{displayedClasses.length}</strong><em>{activeYear ? activeYear.label : "Créez d’abord une année scolaire"}</em></article><article><span className="class-card-icon class-card-icon--green"><UserRound size={21} /></span><p>Élèves affectés</p><strong>—</strong><em>Les inscriptions enrichiront cet indicateur</em></article></section>
    {showYearForm && <section className="student-create-panel class-setup-panel"><div><p className="eyebrow">ANNÉE SCOLAIRE</p><h2>Créer votre première année</h2><p>Elle servira de cadre à vos classes et aux inscriptions.</p></div><form onSubmit={createYear}><label>Libellé<input value={yearLabel} onChange={(event) => setYearLabel(event.target.value)} required /></label><label>Début<input type="date" value={yearStart} onChange={(event) => setYearStart(event.target.value)} required /></label><label>Fin<input type="date" value={yearEnd} onChange={(event) => setYearEnd(event.target.value)} required /></label><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowYearForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Création…" : "Créer l’année"}<ArrowRight size={16} /></button></div></form></section>}
    {showClassForm && activeYear && <section className="student-create-panel class-setup-panel"><div><p className="eyebrow">{activeYear.label.toUpperCase()}</p><h2>Créer une classe</h2><p>Ajoutez un niveau, un nom et une capacité indicative.</p></div><form onSubmit={createClass}><label>Niveau<input value={levelName} onChange={(event) => setLevelName(event.target.value)} required placeholder="Ex. 6e" /></label><label>Nom de classe<input value={className} onChange={(event) => setClassName(event.target.value)} required placeholder="Ex. 6e A" /></label><label>Capacité<input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} required /></label><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowClassForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Création…" : "Créer la classe"}<ArrowRight size={16} /></button></div></form></section>}
    <section className="panel data-panel"><div className="panel-heading"><div><p className="eyebrow">{activeYear ? activeYear.label.toUpperCase() : "MISE EN PLACE"}</p><h2>Répartition des classes</h2></div><button className="text-button" onClick={() => activeYear ? setShowClassForm(true) : setShowYearForm(true)}>{activeYear ? "Ajouter une classe" : "Créer l’année"}<ChevronRight size={16} /></button></div><div className="class-table"><div className="table-head"><span>CLASSE</span><span>NIVEAU</span><span>CAPACITÉ</span><span>ANNÉE</span><span /></div>{displayedClasses.map((schoolClass) => <div className="table-row" key={schoolClass.id}><strong>{schoolClass.name}</strong><span>{schoolClass.level_name}</span><span>{schoolClass.capacity ?? "—"}</span><span>{activeYear?.label}</span><button aria-label={`Gérer ${schoolClass.name}`} onClick={() => onAction(`Gérer ${schoolClass.name}`)}><ChevronRight size={19} /></button></div>)}{!displayedClasses.length && <div className="empty-search">{loading ? "Chargement des classes…" : activeYear ? <><strong>Aucune classe n’a encore été créée pour cette année.</strong><button className="text-button" onClick={() => setShowClassForm(true)}>Créer la première classe <ChevronRight size={16} /></button></> : <><strong>Créez une année scolaire pour commencer à organiser vos classes.</strong><button className="text-button" onClick={() => setShowYearForm(true)}>Créer l’année scolaire <ChevronRight size={16} /></button></>}</div>}</div></section>
  </>;
}

function GenericModule({ schoolId, title, eyebrow, icon: Icon, onAction }: { schoolId: string; title: string; eyebrow: string; icon: typeof CalendarDays; onAction: (name: string) => void }) {
  const descriptions: Record<string, string> = { Pédagogie: "Pilotez les matières, évaluations, notes et bulletins depuis un seul espace.", "Vie scolaire": "Suivez les présences, absences, retards et observations avec des alertes de contexte.", Finances: "Suivez les règlements, échéances, reçus et impayés de votre établissement.", Documents: "Centralisez les pièces administratives, modèles et documents scolaires.", Calendrier: "Coordonnez les temps forts de l’année et les rendez-vous de l’établissement." };
  const moduleSources: Record<string, { table: "assessments" | "attendance_records" | "payments" | "school_documents" | "calendar_events"; singular: string; action: string }> = { Pédagogie: { table: "assessments", singular: "évaluation", action: "Créer une évaluation" }, "Vie scolaire": { table: "attendance_records", singular: "relevé", action: "Enregistrer une présence" }, Finances: { table: "payments", singular: "paiement", action: "Enregistrer un paiement" }, Documents: { table: "school_documents", singular: "document", action: "Ajouter un document" }, Calendrier: { table: "calendar_events", singular: "événement", action: "Ajouter un événement" } };
  const [recordCount, setRecordCount] = useState(0);
  const [recentRecords, setRecentRecords] = useState<Array<Record<string, unknown>>>([]);
  const [showForm, setShowForm] = useState(false);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [students, setStudents] = useState<Array<{ id: string; first_name: string; last_name: string }>>([]);
  const [saving, setSaving] = useState(false);
  const source = moduleSources[title] ?? moduleSources.Pédagogie;
  const recordSelection: Record<string, string> = { assessments: "id, title, assessment_date, created_at", attendance_records: "id, status, attendance_date, created_at", payments: "id, amount, payment_date, reference, created_at", school_documents: "id, title, category, created_at", calendar_events: "id, title, starts_at, description, created_at" };
  const loadRecords = async () => { const [{ count }, { data }] = await Promise.all([supabase.from(source.table).select("id", { count: "exact", head: true }).eq("school_id", schoolId), (supabase.from(source.table) as never as { select: (fields: string) => { eq: (key: string, value: string) => { order: (key: string, options: { ascending: boolean }) => { limit: (limit: number) => PromiseLike<{ data: unknown[] | null }> } } } }).select(recordSelection[source.table]).eq("school_id", schoolId).order("created_at", { ascending: false }).limit(5)]); setRecordCount(count ?? 0); setRecentRecords((data ?? []) as Array<Record<string, unknown>>); };
  useEffect(() => { if (!schoolId) return; void loadRecords(); if (source.table === "attendance_records" || source.table === "payments") void (async () => { const { data } = await supabase.from("students").select("id, first_name, last_name").eq("school_id", schoolId).order("last_name"); setStudents(data ?? []); })(); }, [schoolId, source.table]);
  const saveEntry = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const today = new Date().toISOString().slice(0, 10); setSaving(true); let payload: Record<string, unknown>; if (source.table === "assessments") payload = { school_id: schoolId, title: entryTitle.trim(), assessment_date: today }; else if (source.table === "attendance_records") payload = { school_id: schoolId, student_id: selectedStudent, attendance_date: today, status: "present" }; else if (source.table === "payments") payload = { school_id: schoolId, student_id: selectedStudent || null, amount: Number(entryAmount), payment_date: today, reference: entryTitle.trim() || null }; else if (source.table === "school_documents") payload = { school_id: schoolId, title: entryTitle.trim() }; else payload = { school_id: schoolId, title: entryTitle.trim(), starts_at: new Date().toISOString() }; const { error } = await supabase.from(source.table).insert(payload as never); setSaving(false); if (error) { toast.error("L’enregistrement a échoué", { description: error.message }); return; } setEntryTitle(""); setEntryAmount(""); setSelectedStudent(""); setShowForm(false); await loadRecords(); toast.success(`${source.singular[0].toUpperCase()}${source.singular.slice(1)} ajouté`, { description: "La donnée est disponible dans votre établissement." }); };
  const requiresStudent = source.table === "attendance_records" || source.table === "payments";
  const getRecordTitle = (record: Record<string, unknown>) => { if (source.table === "attendance_records") return `Présence : ${record.status === "present" ? "présent" : record.status === "late" ? "retard" : "absent"}`; if (source.table === "payments") return `${Number(record.amount ?? 0).toLocaleString("fr-FR")} FCFA${record.reference ? ` · ${record.reference}` : ""}`; return String(record.title ?? "Élément sans titre"); };
  const getRecordMeta = (record: Record<string, unknown>) => { const date = record.assessment_date ?? record.attendance_date ?? record.payment_date ?? record.starts_at ?? record.created_at; return date ? new Date(String(date)).toLocaleDateString("fr-FR") : ""; };
  return <><ModuleHeader eyebrow={eyebrow} title={title} action={source.action} onAction={() => setShowForm(true)} />
    <section className="module-hero-panel"><div className="module-hero-icon"><Icon size={29} /></div><div><p className="eyebrow">ESPACE {title.toUpperCase()}</p><h2>{descriptions[title]}</h2><p>Les données saisies dans ce module appartiennent uniquement à votre établissement.</p></div><button className="primary-button" onClick={() => setShowForm(true)}>{source.action}<ArrowUpRight size={17} /></button></section>
    {showForm && <section className="student-create-panel module-entry-form"><div><p className="eyebrow">NOUVELLE DONNÉE</p><h2>{source.action}</h2><p>Cette information sera enregistrée dans l’espace de votre établissement.</p></div><form onSubmit={saveEntry}>{source.table !== "attendance_records" && <label>{source.table === "payments" ? "Référence" : "Titre"}<input value={entryTitle} onChange={(event) => setEntryTitle(event.target.value)} required={source.table !== "payments"} placeholder={source.table === "calendar_events" ? "Ex. Conseil pédagogique" : source.table === "school_documents" ? "Ex. Règlement intérieur" : "Ex. Devoir de mathématiques"} /></label>}{requiresStudent && <label>Élève<select value={selectedStudent} onChange={(event) => setSelectedStudent(event.target.value)} required={source.table === "attendance_records"}><option value="">{students.length ? "Choisir un élève" : "Aucun élève disponible"}</option>{students.map((student) => <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>)}</select></label>}{source.table === "payments" && <label>Montant FCFA<input type="number" min="1" value={entryAmount} onChange={(event) => setEntryAmount(event.target.value)} required placeholder="Ex. 25000" /></label>}<div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Annuler</button><button className="primary-button" disabled={saving || (source.table === "attendance_records" && !students.length)}>{saving ? "Enregistrement…" : source.action}<ArrowRight size={16} /></button></div></form></section>}
    <section className="generic-grid"><article className="panel"><p className="eyebrow">ENREGISTRÉS</p><strong>{recordCount}</strong><p>{recordCount === 1 ? `${source.singular} disponible dans votre établissement.` : `${source.singular}s disponibles dans votre établissement.`}</p><button className="text-button" onClick={() => setShowForm(true)}>Ajouter <ChevronRight size={16} /></button></article><article className="panel"><p className="eyebrow">SUIVI</p><strong>{recordCount ? "À jour" : "À démarrer"}</strong><p>{recordCount ? "Les données de ce module sont reliées à votre établissement." : "Aucune donnée n’a encore été enregistrée dans ce module."}</p><button className="text-button" onClick={() => setShowForm(true)}>Créer une entrée <ChevronRight size={16} /></button></article><article className="panel"><p className="eyebrow">RACCOURCI</p><strong>Action rapide</strong><p>Enregistrez la première donnée de ce module lorsque votre équipe est prête.</p><button className="outline-button" onClick={() => setShowForm(true)}>Lancer l’action <Plus size={16} /></button></article></section>
    <section className="panel data-panel module-records"><div className="panel-heading"><div><p className="eyebrow">DONNÉES RÉCENTES</p><h2>{title}</h2></div><button className="text-button" onClick={() => setShowForm(true)}>Ajouter <ChevronRight size={16} /></button></div>{recentRecords.length ? <div className="module-record-list">{recentRecords.map((record) => <div className="module-record-row" key={String(record.id)}><span className="activity-icon activity-icon--blue"><Icon size={15} /></span><div><strong>{getRecordTitle(record)}</strong><p>{getRecordMeta(record)}</p></div><ChevronRight size={17} /></div>)}</div> : <div className="empty-search"><strong>Aucune donnée enregistrée dans ce module.</strong><button className="text-button" onClick={() => setShowForm(true)}>Ajouter la première entrée <ChevronRight size={16} /></button></div>}</section>
  </>;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeNav, setActiveNav] = useState("Vue d’ensemble");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("Mon établissement");
  const [schoolSlug, setSchoolSlug] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({ attendance: 0, payments: 0, upcomingEvents: 0 });
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected" | "suspended">("approved");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [userName, setUserName] = useState("Mon compte");
  const [loadingAccess, setLoadingAccess] = useState(true);
  useEffect(() => { void (async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) { setLocation("/connexion"); return; } setUserName(String(user.user_metadata.full_name ?? user.email?.split("@")[0] ?? "Mon compte")); setIsPlatformAdmin(await hasPlatformAdminRole()); const { data: schools } = await supabase.from("schools").select("id, name, slug, city, country, approval_status, rejection_reason").limit(1); if (!schools?.length) { setLoadingAccess(false); return; } setSchoolName(schools[0].name); setSchoolId(schools[0].id); setSchoolSlug(schools[0].slug); setApprovalStatus(schools[0].approval_status as "pending" | "approved" | "rejected" | "suspended"); setRejectionReason(schools[0].rejection_reason); setLoadingAccess(false); })(); }, [setLocation]);
  useEffect(() => { if (!schoolId) return; void (async () => { const { count } = await supabase.from("students").select("id", { count: "exact", head: true }).eq("school_id", schoolId); setStudentCount(count ?? 0); })(); }, [schoolId]);
  useEffect(() => { if (!schoolId) return; void (async () => { const today = new Date(); const day = today.toISOString().slice(0, 10); const monthStart = `${day.slice(0, 7)}-01`; const [{ count: attendance }, { count: payments }, { count: upcomingEvents }] = await Promise.all([supabase.from("attendance_records").select("id", { count: "exact", head: true }).eq("school_id", schoolId).eq("attendance_date", day), supabase.from("payments").select("id", { count: "exact", head: true }).eq("school_id", schoolId).gte("payment_date", monthStart), supabase.from("calendar_events").select("id", { count: "exact", head: true }).eq("school_id", schoolId).gte("starts_at", today.toISOString())]); setDashboardStats({ attendance: attendance ?? 0, payments: payments ?? 0, upcomingEvents: upcomingEvents ?? 0 }); })(); }, [schoolId]);
  const onAction = (name: string) => toast.success(name, { description: "Aperçu interactif : cette action ouvrirait le flux correspondant." });
  const moduleMap: Record<string, { eyebrow: string; icon: typeof CalendarDays }> = { Pédagogie: { eyebrow: "GESTION SCOLAIRE", icon: BookOpenCheck }, "Vie scolaire": { eyebrow: "GESTION SCOLAIRE", icon: UserCheck }, Finances: { eyebrow: "ADMINISTRATION", icon: WalletCards }, Documents: { eyebrow: "ADMINISTRATION", icon: FileText }, Calendrier: { eyebrow: "ADMINISTRATION", icon: CalendarDays } };
  const renderContent = () => { if (activeNav === "Vue d’ensemble") return <Dashboard schoolId={schoolId} schoolName={schoolName} studentCount={studentCount} stats={dashboardStats} onAction={onAction} />; if (activeNav === "Élèves") return <StudentsPage schoolId={schoolId} onAction={onAction} />; if (activeNav === "Inscriptions") return <Registrations schoolId={schoolId} schoolSlug={schoolSlug} />; if (activeNav === "Classes") return <ClassesPage schoolId={schoolId} onAction={onAction} />; if (activeNav === "Finances") return <Payments schoolId={schoolId} />; if (activeNav === "Équipe & rôles") return <Roles schoolId={schoolId} />; const module = moduleMap[activeNav] ?? moduleMap.Pédagogie; return <GenericModule schoolId={schoolId} title={activeNav} eyebrow={module.eyebrow} icon={module.icon} onAction={onAction} />; };
  if (loadingAccess) return <div className="dashboard-loading"><GraduationCap size={25} /><span>Ouverture de votre espace Schooly…</span></div>;
  if (isPlatformAdmin) return <div className="supervision-guard"><ShieldCheck size={31} /><h1>Super-administrateur Schooly</h1><p>Votre accès est distinct des tableaux de bord d’établissement. Ouvrez votre poste de supervision pour gérer les demandes multi-écoles.</p><button className="primary-button" onClick={() => setLocation("/supervision")}>Ouvrir la supervision</button><button className="outline-button" onClick={() => { void supabase.auth.signOut(); setLocation("/"); }}>Se déconnecter</button></div>;
  if (approvalStatus !== "approved") return <div className="approval-pending-page"><div className="approval-pending-card"><span className={`approval-pending-icon approval-pending-icon--${approvalStatus}`}>{approvalStatus === "pending" ? <Clock3 size={28} /> : <XCircle size={28} />}</span><p className="landing-eyebrow">{approvalStatus === "pending" ? "DEMANDE EN COURS D’EXAMEN" : approvalStatus === "rejected" ? "DEMANDE REFUSÉE" : "ÉTABLISSEMENT EN PAUSE"}</p><h1>{approvalStatus === "pending" ? "Votre établissement attend votre validation." : approvalStatus === "suspended" ? "Votre établissement est temporairement en pause." : "Votre espace n’est pas actif."}</h1><p>{approvalStatus === "pending" ? "L’équipe Schooly vérifiera votre demande avant d’activer l’accès aux modules de gestion." : approvalStatus === "suspended" ? `Aucune donnée n’a été supprimée : élèves, classes, paiements et documents restent conservés. ${rejectionReason ? `Message de la plateforme : ${rejectionReason}` : "Contactez la plateforme pour reprendre l’accès au même espace."}` : rejectionReason ? `Motif indiqué : ${rejectionReason}` : "Contactez la supervision Schooly pour connaître les prochaines étapes."}</p>{approvalStatus === "suspended" && <div className="approval-data-safe"><ShieldCheck size={17} /><span>À la reprise, votre établissement retrouvera le même espace et toutes ses données.</span></div>}<button className="outline-button" onClick={() => { void supabase.auth.signOut(); setLocation("/"); }}>Se déconnecter</button></div></div>;
  return (
    <div className="schooly-app">
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-top"><div className="brand"><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="Logo Schooly" /><span>schooly</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu"><X size={20} /></button></div>
        <div className="school-switcher"><span className="school-mark">{schoolName.charAt(0).toUpperCase()}</span><div><strong>{schoolName}</strong><small>Votre espace Schooly</small></div><ChevronDown size={16} /></div>
        <nav aria-label="Navigation principale">{navGroups.map((group, index) => <div className="nav-group" key={group.label ?? index}>{group.label && <p>{group.label}</p>}{group.items.map((item) => { const Icon = item.icon; const isActive = activeNav === item.label; return <button key={item.label} className={isActive ? "nav-item nav-item--active" : "nav-item"} onClick={() => { setActiveNav(item.label); setMobileOpen(false); }}><Icon size={18} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>; })}</div>)}</nav>
        <div className="sidebar-bottom"><button className="support-card" onClick={() => onAction("Ouvrir le centre d’aide")}><span><CircleHelp size={17} /></span><div><strong>Besoin d’aide ?</strong><small>Consulter le guide Schooly</small></div><ArrowUpRight size={15} /></button><div className="profile-row"><img src="/manus-storage/schooly-avatar-a_34bb0414.png" alt="" /><div><strong>{userName}</strong><small>Propriétaire</small></div></div><button className="profile-logout" onClick={() => { void supabase.auth.signOut(); setLocation("/"); }}><LogOut size={16} /> Se déconnecter</button></div>
      </aside>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}
      <main className="main-area"><header className="topbar"><button className="mobile-menu" aria-label="Ouvrir le menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>{schoolName}</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="top-actions"><button className="search-shortcut" onClick={() => onAction("Rechercher dans Schooly")}><Search size={17} /><span>Rechercher</span><kbd>⌘ K</kbd></button><div className="notification-wrap"><button className="notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}><Bell size={19} /><i /></button>{notificationsOpen && <div className="notification-popover"><p className="eyebrow">NOTIFICATIONS</p><strong>3 éléments à suivre</strong><span>Retards signalés et échéances à consulter.</span><button onClick={() => { setNotificationsOpen(false); onAction("Afficher les notifications"); }}>Voir les notifications</button></div>}</div><button className="top-logout" onClick={() => { void supabase.auth.signOut(); setLocation("/"); }}><LogOut size={16} /> Se déconnecter</button></div></header><div className="content-wrap">{renderContent()}</div></main>
    </div>
  );
}
