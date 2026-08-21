/**
 * Design Campus Graphique — poste de pilotage éditorial : ivoire chaleureux,
 * bleu nuit structurant et cobalt #2B59FF comme repère d’action.
 */
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
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
} from "lucide-react";
import { toast } from "sonner";

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
    ],
  },
];

const students = [
  { name: "Aïssatou Ndiaye", id: "ELV-2026-00142", className: "4e B", status: "À jour", avatar: "/manus-storage/schooly-avatar-c_e9abd99f.png" },
  { name: "Mamadou Ba", id: "ELV-2026-00123", className: "4e B", status: "À suivre", initials: "MB" },
  { name: "Sokhna Diop", id: "ELV-2026-00156", className: "4e A", status: "À jour", initials: "SD" },
  { name: "Ibrahima Fall", id: "ELV-2026-00117", className: "5e A", status: "À jour", initials: "IF" },
  { name: "Marième Sarr", id: "ELV-2026-00168", className: "3e C", status: "Paiement en attente", initials: "MS" },
];

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

function Dashboard({ onAction }: { onAction: (name: string) => void }) {
  return (
    <>
      <section className="morning-brief">
        <div className="brief-copy">
          <div className="brief-label"><span /> MERCREDI 21 AOÛT</div>
          <h1>La journée est structurée.<br /><em>Passons aux priorités.</em></h1>
          <p>Voici une vue d’ensemble de l’École Horizon pour l’année scolaire 2025–2026.</p>
          <button className="brief-button" onClick={() => onAction("Ajouter un élève")}>
            <Plus size={17} /> Ajouter un élève
          </button>
        </div>
        <div className="brief-image" aria-label="Cour de l’École Horizon" />
        <div className="brief-stamp"><GraduationCap size={18} /><span>Année<br />2025–26</span></div>
      </section>

      <section className="metrics-grid" aria-label="Indicateurs de l’établissement">
        <article className="metric-card metric-card--blue">
          <div className="metric-icon"><UsersRound size={20} /></div>
          <p>Élèves inscrits</p>
          <strong>1 284</strong>
          <span className="metric-trend">+8,4 % <small>vs. année passée</small></span>
        </article>
        <article className="metric-card">
          <div className="metric-icon metric-icon--orange"><UserCheck size={20} /></div>
          <p>Présence aujourd’hui</p>
          <strong>94,2 <small>%</small></strong>
          <div className="tiny-progress"><i style={{ width: "94.2%" }} /></div>
        </article>
        <article className="metric-card">
          <div className="metric-icon metric-icon--green"><WalletCards size={20} /></div>
          <p>Encaissements du mois</p>
          <strong>12,8 M <small>FCFA</small></strong>
          <span className="metric-trend metric-trend--dark">76 % <small>de l’objectif</small></span>
        </article>
        <article className="metric-card metric-card--alert">
          <div className="metric-icon metric-icon--coral"><Bell size={20} /></div>
          <p>Points à suivre</p>
          <strong>23</strong>
          <button className="metric-link" onClick={() => onAction("Ouvrir les points à suivre")}>Voir le détail <ArrowUpRight size={15} /></button>
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
                <div className="ring"><div><strong>94</strong><span>%</span></div></div>
                <p>présence globale</p>
              </div>
              <div className="attendance-breakdown">
                <div><span className="dot dot--green" /> Présents <strong>1 209</strong><i><b style={{ width: "94%" }} /></i></div>
                <div><span className="dot dot--coral" /> Absents <strong>49</strong><i><b style={{ width: "18%" }} /></i></div>
                <div><span className="dot dot--orange" /> Retards <strong>26</strong><i><b style={{ width: "10%" }} /></i></div>
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
              <div className="assessment-row"><span className="subject-pill subject-pill--blue">M</span><div><strong>Mathématiques · 4e B</strong><p>Devoir surveillé du 19 août</p></div><span className="due-pill">12 notes à saisir</span><button onClick={() => onAction("Saisir les notes de mathématiques")}><ChevronRight size={18} /></button></div>
              <div className="assessment-row"><span className="subject-pill subject-pill--orange">F</span><div><strong>Français · 3e C</strong><p>Expression écrite · Séquence 1</p></div><span className="due-pill due-pill--soft">8 notes à valider</span><button onClick={() => onAction("Valider les notes de français")}><ChevronRight size={18} /></button></div>
              <div className="assessment-row"><span className="subject-pill subject-pill--green">S</span><div><strong>SVT · 5e A</strong><p>Interrogation sur les écosystèmes</p></div><span className="due-pill due-pill--soft">Prévue demain</span><button onClick={() => onAction("Voir l’évaluation SVT")}><ChevronRight size={18} /></button></div>
            </div>
          </article>
        </div>

        <aside className="dashboard-side-column">
          <article className="panel agenda-panel">
            <div className="panel-heading compact">
              <div><p className="eyebrow">À VENIR</p><h2>Mon agenda</h2></div>
              <button className="icon-button" aria-label="Voir le calendrier" onClick={() => onAction("Ouvrir le calendrier")}><CalendarDays size={18} /></button>
            </div>
            <div className="agenda-date"><span>21</span><div><strong>AOÛT</strong><p>Mercredi</p></div></div>
            <div className="agenda-entry"><i className="agenda-pin agenda-pin--blue" /><div><strong>Réunion pédagogique</strong><p>10:30 · Salle des professeurs</p></div></div>
            <div className="agenda-entry"><i className="agenda-pin agenda-pin--orange" /><div><strong>Conseil de direction</strong><p>15:00 · Bureau du directeur</p></div></div>
            <button className="outline-button" onClick={() => onAction("Ajouter un événement")}>Ajouter un événement <Plus size={16} /></button>
          </article>

          <article className="panel activity-panel">
            <div className="panel-heading compact"><div><p className="eyebrow">EN DIRECT</p><h2>Activité récente</h2></div><button className="icon-button" aria-label="Options"><MoreHorizontal size={19} /></button></div>
            <div className="activity-list">
              {activity.map(({ title, text, time, icon: Icon, tone }) => <div className="activity-item" key={title}><span className={`activity-icon activity-icon--${tone}`}><Icon size={15} /></span><div><strong>{title}</strong><p>{text}</p><time>{time}</time></div></div>)}
            </div>
          </article>
        </aside>
      </section>
    </>
  );
}

function StudentsPage({ onAction }: { onAction: (name: string) => void }) {
  const [query, setQuery] = useState("");
  const visibleStudents = useMemo(() => students.filter((student) => student.name.toLowerCase().includes(query.toLowerCase()) || student.id.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <>
      <ModuleHeader eyebrow="GESTION SCOLAIRE" title="Élèves" action="Nouvel élève" onAction={() => onAction("Ajouter un nouvel élève")} />
      <section className="module-summary-strip">
        <div><span>1 284</span><p>élèves actifs</p></div><div><span>96 %</span><p>dossiers complets</p></div><div><span>18</span><p>inscriptions à valider</p></div>
        <button className="soft-button" onClick={() => onAction("Importer un fichier d’élèves")}>Importer CSV / Excel <ArrowUpRight size={16} /></button>
      </section>
      <section className="panel data-panel">
        <div className="data-toolbar"><div className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un élève ou un matricule" /></div><button className="filter-button" onClick={() => onAction("Ouvrir les filtres")}><Settings size={16} /> Filtres</button></div>
        <div className="student-table" role="table">
          <div className="table-head" role="row"><span>ÉLÈVE</span><span>MATRICULE</span><span>CLASSE</span><span>STATUT</span><span /></div>
          {visibleStudents.map((student) => <div className="table-row" role="row" key={student.id}><div className="student-cell">{student.avatar ? <img src={student.avatar} alt="" /> : <InitialAvatar initials={student.initials ?? ""} />}<strong>{student.name}</strong></div><span className="id-code">{student.id}</span><span>{student.className}</span><span className={`status-chip ${student.status === "À jour" ? "status-chip--good" : "status-chip--watch"}`}>{student.status}</span><button aria-label={`Voir ${student.name}`} onClick={() => onAction(`Ouvrir la fiche de ${student.name}`)}><ChevronRight size={19} /></button></div>)}
          {!visibleStudents.length && <div className="empty-search">Aucun élève ne correspond à votre recherche.</div>}
        </div>
      </section>
    </>
  );
}

function ClassesPage({ onAction }: { onAction: (name: string) => void }) {
  return (
    <><ModuleHeader eyebrow="GESTION SCOLAIRE" title="Classes & niveaux" action="Créer une classe" onAction={() => onAction("Créer une classe")} />
      <section className="class-cards">
        <article><span className="class-card-icon"><GraduationCap size={21} /></span><p>Capacité globale</p><strong>1 284 <small>/ 1 480</small></strong><i><b style={{ width: "87%" }} /></i><em>87 % de remplissage</em></article>
        <article><span className="class-card-icon class-card-icon--orange"><BookOpenCheck size={21} /></span><p>Classes actives</p><strong>42</strong><em>Du préscolaire à la terminale</em></article>
        <article><span className="class-card-icon class-card-icon--green"><UserRound size={21} /></span><p>Enseignants référents</p><strong>68</strong><em>2 affectations à compléter</em></article>
      </section>
      <section className="panel data-panel"><div className="panel-heading"><div><p className="eyebrow">ANNÉE 2025–2026</p><h2>Répartition des classes</h2></div><button className="text-button" onClick={() => onAction("Gérer les niveaux")}>Gérer les niveaux <ChevronRight size={16} /></button></div>
      <div className="class-table"><div className="table-head"><span>CLASSE</span><span>ÉLÈVES</span><span>REMPLISSAGE</span><span>PROFESSEUR PRINCIPAL</span><span /></div>{classes.map(([name, active, capacity, teacher]) => <div className="table-row" key={name}><strong>{name}</strong><span>{active} / {capacity}</span><div className="occupancy"><i><b style={{ width: `${Math.round((Number(active) / Number(capacity)) * 100)}%` }} /></i><small>{Math.round((Number(active) / Number(capacity)) * 100)} %</small></div><span>{teacher}</span><button aria-label={`Gérer ${name}`} onClick={() => onAction(`Gérer la classe ${name}`)}><ChevronRight size={19} /></button></div>)}</div></section>
    </>
  );
}

function GenericModule({ title, eyebrow, icon: Icon, onAction }: { title: string; eyebrow: string; icon: typeof CalendarDays; onAction: (name: string) => void }) {
  const descriptions: Record<string, string> = { Pédagogie: "Pilotez les matières, évaluations, notes et bulletins depuis un seul espace.", "Vie scolaire": "Suivez les présences, absences, retards et observations avec des alertes de contexte.", Finances: "Suivez les règlements, échéances, reçus et impayés de votre établissement.", Documents: "Centralisez les pièces administratives, modèles et documents scolaires.", Calendrier: "Coordonnez les temps forts de l’année et les rendez-vous de l’établissement." };
  return <><ModuleHeader eyebrow={eyebrow} title={title} action={title === "Finances" ? "Enregistrer un paiement" : `Créer dans ${title.toLowerCase()}`} onAction={() => onAction(`Créer dans ${title}`)} />
    <section className="module-hero-panel"><div className="module-hero-icon"><Icon size={29} /></div><div><p className="eyebrow">ESPACE {title.toUpperCase()}</p><h2>{descriptions[title]}</h2><p>Ce tableau de travail offre un aperçu structuré des informations essentielles, avec des actions dédiées à votre rôle.</p></div><button className="primary-button" onClick={() => onAction(`Explorer ${title}`)}>Explorer l’espace <ArrowUpRight size={17} /></button></section>
    <section className="generic-grid"><article className="panel"><p className="eyebrow">À TRAITER</p><strong>{title === "Finances" ? "23 échéances" : "8 éléments"}</strong><p>Demandent votre attention cette semaine.</p><button className="text-button" onClick={() => onAction(`Voir les éléments à traiter : ${title}`)}>Consulter <ChevronRight size={16} /></button></article><article className="panel"><p className="eyebrow">CE MOIS-CI</p><strong>{title === "Pédagogie" ? "186 évaluations" : "42 mises à jour"}</strong><p>Une activité regroupée pour faciliter le suivi.</p><button className="text-button" onClick={() => onAction(`Voir l’activité : ${title}`)}>Voir l’activité <ChevronRight size={16} /></button></article><article className="panel"><p className="eyebrow">RACCOURCI</p><strong>Action rapide</strong><p>Accédez directement à la tâche la plus courante.</p><button className="outline-button" onClick={() => onAction(`Action rapide : ${title}`)}>Lancer l’action <Plus size={16} /></button></article></section>
  </>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Vue d’ensemble");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const onAction = (name: string) => toast.success(name, { description: "Aperçu interactif : cette action ouvrirait le flux correspondant." });
  const moduleMap: Record<string, { eyebrow: string; icon: typeof CalendarDays }> = { Pédagogie: { eyebrow: "GESTION SCOLAIRE", icon: BookOpenCheck }, "Vie scolaire": { eyebrow: "GESTION SCOLAIRE", icon: UserCheck }, Finances: { eyebrow: "ADMINISTRATION", icon: WalletCards }, Documents: { eyebrow: "ADMINISTRATION", icon: FileText }, Calendrier: { eyebrow: "ADMINISTRATION", icon: CalendarDays } };
  const renderContent = () => { if (activeNav === "Vue d’ensemble") return <Dashboard onAction={onAction} />; if (activeNav === "Élèves") return <StudentsPage onAction={onAction} />; if (activeNav === "Classes") return <ClassesPage onAction={onAction} />; const module = moduleMap[activeNav] ?? moduleMap.Pédagogie; return <GenericModule title={activeNav} eyebrow={module.eyebrow} icon={module.icon} onAction={onAction} />; };
  return (
    <div className="schooly-app">
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-top"><div className="brand"><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="Logo Schooly" /><span>schooly</span></div><button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu"><X size={20} /></button></div>
        <div className="school-switcher"><span className="school-mark">H</span><div><strong>École Horizon</strong><small>Dakar, Sénégal</small></div><ChevronDown size={16} /></div>
        <nav aria-label="Navigation principale">{navGroups.map((group, index) => <div className="nav-group" key={group.label ?? index}>{group.label && <p>{group.label}</p>}{group.items.map((item) => { const Icon = item.icon; const isActive = activeNav === item.label; return <button key={item.label} className={isActive ? "nav-item nav-item--active" : "nav-item"} onClick={() => { setActiveNav(item.label); setMobileOpen(false); }}><Icon size={18} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>; })}</div>)}</nav>
        <div className="sidebar-bottom"><button className="support-card" onClick={() => onAction("Ouvrir le centre d’aide")}><span><CircleHelp size={17} /></span><div><strong>Besoin d’aide ?</strong><small>Consulter le guide Schooly</small></div><ArrowUpRight size={15} /></button><div className="profile-row"><img src="/manus-storage/schooly-avatar-a_34bb0414.png" alt="" /><div><strong>Aminata Seck</strong><small>Directrice</small></div><button aria-label="Ouvrir les réglages" onClick={() => onAction("Ouvrir les réglages")}><Settings size={17} /></button></div></div>
      </aside>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} />}
      <main className="main-area"><header className="topbar"><button className="mobile-menu" aria-label="Ouvrir le menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>École Horizon</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="top-actions"><button className="search-shortcut" onClick={() => onAction("Rechercher dans Schooly")}><Search size={17} /><span>Rechercher</span><kbd>⌘ K</kbd></button><div className="notification-wrap"><button className="notification-button" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}><Bell size={19} /><i /></button>{notificationsOpen && <div className="notification-popover"><p className="eyebrow">NOTIFICATIONS</p><strong>3 éléments à suivre</strong><span>Retards signalés et échéances à consulter.</span><button onClick={() => { setNotificationsOpen(false); onAction("Afficher les notifications"); }}>Voir les notifications</button></div>}</div></div></header><div className="content-wrap">{renderContent()}</div></main>
    </div>
  );
}
