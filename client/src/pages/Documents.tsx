import { Download, FileArchive, FileText, Plus, Upload } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";

type Document = { id: string; title: string; category: string | null; issued_on: string | null; expires_on: string | null; media_asset_id: string | null; created_at: string };
type MediaAsset = { id: string; delivery_url: string; mime_type: string | null; bytes: number | null };

export default function Documents({ schoolId }: { schoolId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [assets, setAssets] = useState<Record<string, MediaAsset>>({});
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Administratif");
  const [issuedOn, setIssuedOn] = useState(new Date().toISOString().slice(0, 10));
  const [expiresOn, setExpiresOn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const signature = trpc.media.createUploadSignature.useMutation();

  const load = async () => {
    const { data, error } = await supabase.from("school_documents").select("id, title, category, issued_on, expires_on, media_asset_id, created_at").eq("school_id", schoolId).order("created_at", { ascending: false });
    if (error) { toast.error("Impossible de charger les documents", { description: error.message }); return; }
    const current = (data ?? []) as Document[]; setDocuments(current);
    const ids = current.flatMap((document) => document.media_asset_id ? [document.media_asset_id] : []);
    if (!ids.length) { setAssets({}); return; }
    const { data: assetData } = await supabase.from("media_assets").select("id, delivery_url, mime_type, bytes").in("id", ids);
    setAssets(Object.fromEntries(((assetData ?? []) as MediaAsset[]).map((asset) => [asset.id, asset])));
  };

  useEffect(() => { void load(); }, [schoolId]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) { toast.error("Ajoutez un fichier avant de continuer."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Document trop volumineux", { description: "La limite est de 10 Mo." }); return; }
    setSaving(true);
    try {
      const signed = await signature.mutateAsync({ schoolId, kind: "school-document" });
      const payload = new FormData();
      payload.append("file", file); payload.append("api_key", signed.apiKey); payload.append("timestamp", String(signed.timestamp)); payload.append("folder", signed.folder); payload.append("signature", signed.signature);
      const response = await fetch(signed.endpoint, { method: "POST", body: payload });
      const upload = await response.json() as { secure_url?: string; public_id?: string; bytes?: number };
      if (!response.ok || !upload.secure_url || !upload.public_id) throw new Error("Le document n’a pas pu être transféré.");
      const { data: { user } } = await supabase.auth.getUser();
      const { data: asset, error: assetError } = await supabase.from("media_assets").insert({ school_id: schoolId, owner_id: user?.id ?? null, kind: "school_document", cloudinary_public_id: upload.public_id, delivery_url: upload.secure_url, mime_type: file.type || null, bytes: upload.bytes ?? file.size }).select("id").single();
      if (assetError || !asset) throw assetError ?? new Error("Les métadonnées du document n’ont pas été enregistrées.");
      const { error } = await supabase.from("school_documents").insert({ school_id: schoolId, media_asset_id: asset.id, title: title.trim(), category: category.trim() || null, issued_on: issuedOn || null, expires_on: expiresOn || null, created_by: user?.id ?? null });
      if (error) throw error;
      setTitle(""); setCategory("Administratif"); setIssuedOn(new Date().toISOString().slice(0, 10)); setExpiresOn(""); setFile(null); setShowForm(false); toast.success("Document ajouté"); await load();
    } catch (uploadError) {
      toast.error("Le document n’a pas été ajouté", { description: uploadError instanceof Error ? uploadError.message : "Une erreur est survenue." });
    } finally { setSaving(false); }
  };

  const formatBytes = (bytes: number | null | undefined) => !bytes ? "—" : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} Ko` : `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;

  return <><div className="module-header"><div><p className="eyebrow">ARCHIVES SÉCURISÉES</p><h1>Documents</h1></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={16} /> Ajouter un document</button></div>
    <section className="document-summary"><article><span><FileArchive size={19} /></span><div><p>Documents archivés</p><strong>{documents.length}</strong></div></article><article><span><FileText size={19} /></span><div><p>À échéance</p><strong>{documents.filter((document) => document.expires_on && new Date(document.expires_on) <= new Date(Date.now() + 30 * 86400000)).length}</strong></div></article></section>
    {showForm && <section className="student-create-panel document-form"><div><p className="eyebrow">NOUVEAU DOCUMENT</p><h2>Déposer un fichier</h2><p>Le document est lié uniquement à votre établissement et enregistré avec ses métadonnées.</p></div><form onSubmit={save}><label>Titre<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Assurance scolaire 2026" required /></label><label>Catégorie<input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Administratif" /></label><label>Date d’émission<input type="date" value={issuedOn} onChange={(event) => setIssuedOn(event.target.value)} /></label><label>Échéance facultative<input type="date" value={expiresOn} onChange={(event) => setExpiresOn(event.target.value)} /></label><label className="document-upload-input">Fichier (PDF, image ou document, 10 Mo maximum)<input type="file" accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /><small>{file ? `${file.name} · ${formatBytes(file.size)}` : "Sélectionnez le fichier à archiver."}</small></label><div className="student-form-actions"><button type="button" className="outline-button" onClick={() => setShowForm(false)}>Annuler</button><button className="primary-button" disabled={saving}>{saving ? "Transfert…" : <><Upload size={16} /> Archiver le document</>}</button></div></form></section>}
    <section className="panel document-list"><div className="panel-heading"><div><p className="eyebrow">BIBLIOTHÈQUE</p><h2>Documents de l’établissement</h2></div></div>{documents.length ? documents.map((document) => { const asset = document.media_asset_id ? assets[document.media_asset_id] : undefined; return <div className="document-row" key={document.id}><span><FileText size={19} /></span><div><strong>{document.title}</strong><small>{document.category ?? "Sans catégorie"} · {document.issued_on ? `émis le ${new Date(document.issued_on).toLocaleDateString("fr-FR")}` : "sans date"}{document.expires_on ? ` · expire le ${new Date(document.expires_on).toLocaleDateString("fr-FR")}` : ""}</small></div><em>{formatBytes(asset?.bytes)}</em>{asset && <a className="outline-button" href={asset.delivery_url} target="_blank" rel="noreferrer"><Download size={15} /> Ouvrir</a>}</div>; }) : <div className="empty-search">Aucun document archivé. Ajoutez les documents administratifs de l’établissement ici.</div>}</section>
  </>;
}
