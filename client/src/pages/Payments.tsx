import { CheckCircle2, CreditCard, Plus, QrCode, ReceiptText, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Student = { id: string; first_name: string; last_name: string; student_number: string };
type PaymentStatus = { id: string; student_id: string; billing_month: string; amount_due: number; amount_paid: number; status: "paid" | "partial" | "unpaid" | "exempt" };
type StudentCard = { student_id: string; qr_token: string; active: boolean };
const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function Payments({ schoolId }: { schoolId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [statuses, setStatuses] = useState<PaymentStatus[]>([]);
  const [cards, setCards] = useState<StudentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [studentId, setStudentId] = useState("");
  const [amountDue, setAmountDue] = useState("25000");
  const [amountPaid, setAmountPaid] = useState("25000");
  const [month, setMonth] = useState(currentMonth());
  const [saving, setSaving] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StudentCard | null>(null);
  const [ledgerStudentId, setLedgerStudentId] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: studentData, error: studentError }, { data: statusData, error: statusError }, { data: cardData, error: cardError }] = await Promise.all([
      supabase.from("students").select("id, first_name, last_name, student_number").eq("school_id", schoolId).eq("status", "active").order("last_name"),
      supabase.from("student_monthly_payment_statuses").select("id, student_id, billing_month, amount_due, amount_paid, status").eq("school_id", schoolId).order("billing_month", { ascending: false }),
      supabase.from("student_access_cards").select("student_id, qr_token, active").eq("school_id", schoolId),
    ]);
    setStudents((studentData ?? []) as Student[]);
    setStatuses((statusData ?? []) as PaymentStatus[]);
    setCards((cardData ?? []) as StudentCard[]);
    setLoadError(studentError?.message ?? statusError?.message ?? cardError?.message ?? "");
    setLoading(false);
  };
  useEffect(() => { void load(); }, [schoolId]);
  const studentsById = useMemo(() => new Map(students.map((student) => [student.id, student])), [students]);
  const paidThisMonth = statuses.filter((item) => item.billing_month.startsWith(month) && item.status === "paid").length;
  const ledger = ledgerStudentId ? statuses.filter((item) => item.student_id === ledgerStudentId) : statuses.slice(0, 8);

  const recordPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!studentId) return;
    setSaving(true);
    const due = Number(amountDue);
    const paid = Number(amountPaid);
    const status = paid >= due ? "paid" : paid > 0 ? "partial" : "unpaid";
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("student_monthly_payment_statuses").insert({ school_id: schoolId, student_id: studentId, billing_month: `${month}-01`, amount_due: due, amount_paid: paid, status, recorded_by: user?.id ?? null, recorded_at: paid > 0 ? new Date().toISOString() : null });
    setSaving(false);
    if (error) { toast.error("Le statut n’a pas été enregistré", { description: error.message }); return; }
    setStudentId("");
    await load();
    toast.success(status === "paid" ? "Paiement enregistré" : "Statut de paiement enregistré");
  };

  const showCard = async (id: string) => {
    let card = cards.find((item) => item.student_id === id);
    if (!card) {
      const { data, error } = await supabase.from("student_access_cards").insert({ school_id: schoolId, student_id: id }).select("student_id, qr_token, active").single();
      if (error || !data) { toast.error("La carte QR n’a pas été créée", { description: error?.message }); return; }
      card = data as StudentCard;
      setCards((current) => [...current, card!]);
    }
    setSelectedCard(card);
  };

  const selectedStudent = selectedCard ? studentsById.get(selectedCard.student_id) : null;
  const printReceipt = (item: PaymentStatus) => {
    const student = studentsById.get(item.student_id);
    if (!student) return;
    const receipt = window.open("", "_blank", "width=720,height=820");
    if (!receipt) { toast.error("Autorisez les fenêtres contextuelles pour imprimer le reçu."); return; }
    const safe = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
    receipt.document.write(`<!doctype html><html lang="fr"><head><title>Reçu Schooly</title><style>body{font-family:Arial,sans-serif;color:#17315e;padding:42px}.brand{font-size:26px;font-weight:800;color:#2b59ff}.box{margin-top:28px;border:1px solid #d9e1ef;border-radius:12px;padding:24px}.row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #edf0f4}.row:last-child{border:0}.amount{font-size:23px;font-weight:800}.muted{color:#6d7f98;font-size:12px}</style></head><body><div class="brand">schooly</div><p class="muted">Reçu de paiement · ${new Date().toLocaleDateString("fr-FR")}</p><div class="box"><h1>Reçu de scolarité</h1><div class="row"><span>Élève</span><strong>${safe(`${student.first_name} ${student.last_name}`)}</strong></div><div class="row"><span>Matricule</span><strong>${safe(student.student_number)}</strong></div><div class="row"><span>Période</span><strong>${new Date(item.billing_month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</strong></div><div class="row"><span>Montant réglé</span><strong class="amount">${Number(item.amount_paid).toLocaleString("fr-FR")} FCFA</strong></div><div class="row"><span>Montant dû</span><strong>${Number(item.amount_due).toLocaleString("fr-FR")} FCFA</strong></div><div class="row"><span>Statut</span><strong>${item.status === "paid" ? "Réglé" : "Paiement partiel"}</strong></div></div><p class="muted">Document généré par Schooly.</p></body></html>`);
    receipt.document.close();
    receipt.focus();
    receipt.print();
  };
  return <>
    <div className="module-header"><div><p className="eyebrow">ADMINISTRATION</p><h1>Paiements mensuels</h1></div><button className="primary-button" onClick={() => void load()}><RefreshCw size={16} /> Actualiser</button></div>
    <section className="payment-summary">
      <article><span><CreditCard size={19} /></span><div><p>Élèves actifs</p><strong>{students.length}</strong></div></article>
      <article><span><CheckCircle2 size={19} /></span><div><p>Réglés ce mois</p><strong>{paidThisMonth}</strong></div></article>
      <article><span><QrCode size={19} /></span><div><p>Cartes QR créées</p><strong>{cards.length}</strong></div></article>
    </section>
    <section className="payment-layout">
      <section className="panel payment-form"><div className="panel-heading"><div><p className="eyebrow">NOUVEAU STATUT</p><h2>Enregistrer un paiement</h2></div></div><form onSubmit={recordPayment}><label>Élève<select value={studentId} onChange={(event) => setStudentId(event.target.value)} required><option value="">Choisir un élève</option>{students.map((student) => <option key={student.id} value={student.id}>{student.last_name} {student.first_name} · {student.student_number}</option>)}</select></label><div className="payment-row"><label>Mois<input type="month" value={month} onChange={(event) => setMonth(event.target.value)} required /></label><label>Montant dû<input type="number" min="0" value={amountDue} onChange={(event) => setAmountDue(event.target.value)} required /></label></div><label>Montant réglé<input type="number" min="0" value={amountPaid} onChange={(event) => setAmountPaid(event.target.value)} required /></label><button className="primary-button" disabled={saving || !students.length}>{saving ? "Enregistrement…" : <><Plus size={16} /> Enregistrer</>}</button></form></section>
      <section className="panel payment-list"><div className="panel-heading"><div><p className="eyebrow">RELEVÉ DES PAIEMENTS</p><h2>{ledgerStudentId ? "Historique de l’élève" : "Statuts récents"}</h2></div><select value={ledgerStudentId} onChange={(event) => setLedgerStudentId(event.target.value)} aria-label="Filtrer le relevé par élève"><option value="">Tous les élèves</option>{students.map((student) => <option key={student.id} value={student.id}>{student.last_name} {student.first_name}</option>)}</select></div>{loadError ? <div className="empty-search">Impossible de charger le relevé : {loadError}</div> : ledger.length ? ledger.map((item) => { const student = studentsById.get(item.student_id); return <div className="payment-status-row" key={item.id}><span className={`status-chip ${item.status === "paid" ? "status-chip--good" : "status-chip--watch"}`}>{item.status === "paid" ? "Réglé" : item.status === "partial" ? "Partiel" : item.status === "exempt" ? "Exonéré" : "Impayé"}</span><div><strong>{student ? `${student.first_name} ${student.last_name}` : "Élève"}</strong><small>{new Date(item.billing_month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })} · {Number(item.amount_paid).toLocaleString("fr-FR")} / {Number(item.amount_due).toLocaleString("fr-FR")} FCFA</small></div><div className="payment-row-actions">{student && <button onClick={() => void showCard(student.id)} aria-label="Afficher la carte QR"><QrCode size={18} /></button>}{student && (item.status === "paid" || item.status === "partial") && <button onClick={() => printReceipt(item)} aria-label="Imprimer le reçu"><ReceiptText size={17} /></button>}</div></div>; }) : <div className="empty-search">{loading ? "Chargement des paiements…" : ledgerStudentId ? "Aucun statut mensuel pour cet élève." : "Aucun statut mensuel enregistré."}</div>}</section>
    </section>
    <section className="panel payment-card-maker"><div><p className="eyebrow">CARTE ÉLÈVE</p><h2>Créer ou afficher une carte QR</h2><p>Le QR permet au personnel ayant le droit de consulter les paiements de vérifier le statut de l’élève.</p></div><select value={selectedCard?.student_id ?? ""} onChange={(event) => void showCard(event.target.value)}><option value="">Choisir un élève</option>{students.map((student) => <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>)}</select>{selectedCard && selectedStudent && <div className="qr-card"><QRCodeSVG value={`${window.location.origin}/carte/${selectedCard.qr_token}`} size={106} bgColor="#fffefa" fgColor="#17315e" includeMargin /><div><strong>{selectedStudent.first_name} {selectedStudent.last_name}</strong><small>{selectedStudent.student_number}</small><em>Lecture réservée au personnel autorisé</em></div></div>}</section>
  </>;
}
