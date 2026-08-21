/**
 * Poste de supervision Schooly — réservé aux administrateurs de plateforme.
 */
import { supabase } from "@/lib/supabase";
import { CheckCircle2, ChevronLeft, Clock3, LoaderCircle, ShieldCheck, Slash, School, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type ManagedSchool = {
  id: string;
  name: string;
  city: string | null;
  country: string;
  created_at: string;
  approval_status: "pending" | "approved" | "rejected" | "suspended";
  rejection_reason: string | null;
};

const statusLabels = { pending: "En attente", approved: "Approuvée", rejected: "Refusée", suspended: "Suspendue" } as const;

export default function Supervision() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "forbidden" | "ready">("loading");
  const [schools, setSchools] = useState<ManagedSchool[]>([]);
  const [filter, setFilter] = useState<"all" | ManagedSchool["approval_status"]>("pending");
  const [processing, setProcessing] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const loadSchools = async () => {
    const { data, error } = await supabase.from("schools").select("id, name, city, country, created_at, approval_status, rejection_reason").order("created_at", { ascending: false });
    if (!error) setSchools((data ?? []) as ManagedSchool[]);
  };

  useEffect(() => { void (async () => { const { data: { user } } = await supabase.auth.getUser(); if (!user) { setLocation("/connexion?role=platform"); return; } const { data: admin } = await supabase.from("platform_admins").select("user_id").eq("user_id", user.id).eq("status", "active").maybeSingle(); if (!admin) { setStatus("forbidden"); return; } await loadSchools(); setStatus("ready"); })(); }, [setLocation]);

  const filtered = useMemo(() => filter === "all" ? schools : schools.filter((school) => school.approval_status === filter), [filter, schools]);
  const decide = async (schoolId: string, decision: "approved" | "rejected" | "suspended") => { setProcessing(schoolId); const { error } = await supabase.rpc("approve_school", { p_school_id: schoolId, p_decision: decision, p_reason: decision === "rejected" ? reason : null }); setProcessing(null); if (error) return; setReason(""); await loadSchools(); };

  if (status === "loading") return <div className="dashboard-loading"><LoaderCircle size={25} /><span>Ouverture de la supervision Schooly…</span></div>;
  if (status === "forbidden") return <div className="supervision-guard"><ShieldCheck size={31} /><h1>Accès réservé</h1><p>Votre compte n’est pas encore déclaré comme super-administrateur de la plateforme.</p><button className="primary-button" onClick={() => setLocation("/app")}>Retour à mon espace</button></div>;

  return <div className="supervision-page"><header className="supervision-nav"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><div><p>PLATEFORME</p><strong>Supervision globale</strong></div><button className="outline-button" onClick={() => setLocation("/app")}><ChevronLeft size={16} /> Mon espace</button></header><main className="supervision-content"><section className="supervision-hero"><div><p className="landing-eyebrow"><i /> GOUVERNANCE MULTI-ÉCOLES</p><h1>Décider qui entre<br />dans <em>l’écosystème Schooly.</em></h1><p>Les établissements restent en attente tant que vous ne les avez pas approuvés. Vous pouvez également refuser ou suspendre leurs accès.</p></div><div className="supervision-count"><span>{schools.filter((school) => school.approval_status === "pending").length}</span><p>demandes à traiter</p></div></section><section className="supervision-tabs">{(["pending", "approved", "rejected", "suspended", "all"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value === "all" ? "Toutes" : statusLabels[value]} <b>{value === "all" ? schools.length : schools.filter((school) => school.approval_status === value).length}</b></button>)}</section><section className="supervision-list">{filtered.map((school) => <article className="school-approval-card" key={school.id}><div className="school-approval-mark"><School size={21} /></div><div className="school-approval-info"><p>{school.city ? `${school.city} · ${school.country}` : school.country}</p><h2>{school.name}</h2><span>Demande du {new Date(school.created_at).toLocaleDateString("fr-FR")}</span>{school.rejection_reason && <small>Motif : {school.rejection_reason}</small>}</div><span className={`approval-status approval-status--${school.approval_status}`}>{school.approval_status === "pending" ? <Clock3 size={14} /> : school.approval_status === "approved" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{statusLabels[school.approval_status]}</span><div className="school-approval-actions">{school.approval_status !== "approved" && <button className="primary-button" disabled={processing === school.id} onClick={() => decide(school.id, "approved")}>Approuver</button>}{school.approval_status === "pending" && <><input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Motif du refus (facultatif)" /><button className="outline-button" disabled={processing === school.id} onClick={() => decide(school.id, "rejected")}>Refuser</button></>}{school.approval_status === "approved" && <button className="outline-button danger" disabled={processing === school.id} onClick={() => decide(school.id, "suspended")}><Slash size={15} /> Suspendre</button>}</div></article>)}{!filtered.length && <div className="supervision-empty"><School size={27} /><strong>Aucun établissement dans cette liste.</strong><p>Les nouvelles demandes apparaîtront ici dès leur création.</p></div>}</section></main></div>;
}
