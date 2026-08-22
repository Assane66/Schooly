import { Megaphone, Plus, Send, UsersRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Announcement = { id: string; title: string; body: string; audience: "school" | "staff" | "families"; published_at: string; expires_at: string | null; created_at: string };
const audienceLabels = { school: "Toute l’école", staff: "Équipe", families: "Élèves & familles" };

export default function Communications({ schoolId }: { schoolId: string }) {
  const [items, setItems] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<Announcement["audience"]>("school");
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => { const { data, error } = await supabase.from("school_announcements").select("id, title, body, audience, published_at, expires_at, created_at").eq("school_id", schoolId).order("published_at", { ascending: false }); if (error) { toast.error("Impossible de charger les annonces", { description: error.message }); return; } setItems((data ?? []) as Announcement[]); };
  useEffect(() => { void load(); }, [schoolId]);
  const publish = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); const { data: { user } } = await supabase.auth.getUser(); const { error } = await supabase.from("school_announcements").insert({ school_id: schoolId, title: title.trim(), body: body.trim(), audience, expires_at: expiresAt || null, created_by: user?.id ?? null }); setSaving(false); if (error) { toast.error("L’annonce n’a pas été publiée", { description: error.message }); return; } setTitle(""); setBody(""); setAudience("school"); setExpiresAt(""); setShowForm(false); toast.success("Annonce publiée"); await load(); };
  const active = items.filter((item) => !item.expires_at || new Date(item.expires_at) >= new Date());
  return <><div className="module-header"><div><p className="eyebrow">COMMUNICATION INTERNE</p><h1>Annonces</h1></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={16} /> Publier une annonce</button></div>
    <section className="communication-summary"><article><span><Megaphone size={19} /></span><div><p>Annonces actives</p><strong>{active.length}</strong></div></article><article><span><UsersRound size={19} /></span><div><p>Audiences préparées</p><strong>3</strong></div></article></section>
    {showForm && <section className="student-create-panel announcement-form"><div><p className="eyebrow">NOUVELLE ANNONCE</p><h2>Informer votre établissement</h2><p>Publiez une annonce pour toute l’école, l’équipe ou les familles.</p></div><form onSubmit={publish}><label>Titre<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Réunion de rentrée" required /></label><label>Audience<select value={audience} onChange={(event) => setAudience(event.target.value as Announcement["audience"])}><option value="school">Toute l’école</option><option value="staff">Équipe</option><option value="families">Élèves & familles</option></select></label><label className="announcement-body">Message<textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Rédigez une information claire pour votre audience…" required /></label><label>Fin de diffusion facultative<input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} /></label><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Publication…" : <><Send size={16} /> Publier</>}</button></div></form></section>}
    <section className="panel announcement-list"><div className="panel-heading"><div><p className="eyebrow">FIL D’INFORMATION</p><h2>Annonces récentes</h2></div></div>{items.length ? items.map((item) => <article className={`announcement-row ${!active.includes(item) ? "announcement-row--expired" : ""}`} key={item.id}><span><Megaphone size={18} /></span><div><div className="announcement-row-title"><strong>{item.title}</strong><em>{audienceLabels[item.audience]}</em></div><p>{item.body}</p><small>Publié le {new Date(item.published_at).toLocaleDateString("fr-FR")}{item.expires_at ? ` · diffusion jusqu’au ${new Date(item.expires_at).toLocaleDateString("fr-FR")}` : ""}</small></div></article>) : <div className="empty-search">Aucune annonce. Publiez une première information pour votre établissement.</div>}</section>
  </>;
}
