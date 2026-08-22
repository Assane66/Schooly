import { CheckCircle2, CircleAlert, LoaderCircle, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { supabase } from "@/lib/supabase";

type CardPayment = { month: string; status: "paid" | "partial" | "unpaid" | "exempt"; amount_due: number; amount_paid: number };
type CardResult = { student: { id: string; first_name: string; last_name: string; student_number: string }; payments: CardPayment[] };

export default function PaymentCardLookup() {
  const { qrToken } = useParams<{ qrToken: string }>();
  const [result, setResult] = useState<CardResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lookup = async () => {
      if (!qrToken) { setError("Ce lien de carte est incomplet."); setLoading(false); return; }
      const { data, error: lookupError } = await supabase.rpc("lookup_student_payment_card", { p_qr_token: qrToken });
      if (lookupError) { setError(lookupError.message.includes("Accès") ? "Connectez-vous avec un compte autorisé à consulter les paiements de cet établissement." : "Cette carte ne peut pas être vérifiée pour le moment."); setLoading(false); return; }
      if (!data || typeof data !== "object" || !("student" in data) || !("payments" in data)) setError("Cette carte est introuvable ou inactive.");
      else setResult(data as CardResult);
      setLoading(false);
    };
    void lookup();
  }, [qrToken]);

  const latestPayment = result?.payments[0];
  const label = latestPayment?.status === "paid" ? "Paiement à jour" : latestPayment?.status === "partial" ? "Paiement partiel" : latestPayment?.status === "exempt" ? "Exonéré" : "Paiement à régulariser";
  return <main className="card-lookup"><Link href="/" className="lookup-brand"><QrCode size={20} /> schooly</Link><section className="lookup-card"><div className="lookup-icon">{loading ? <LoaderCircle className="spin" size={30} /> : error ? <CircleAlert size={30} /> : latestPayment?.status === "paid" ? <CheckCircle2 size={30} /> : <ShieldCheck size={30} />}</div>{loading ? <><p className="eyebrow">VÉRIFICATION SÉCURISÉE</p><h1>Lecture de la carte</h1><p>Le statut de paiement est en cours de vérification.</p></> : error ? <><p className="eyebrow">CARTE NON VALIDE</p><h1>Vérification impossible</h1><p>{error}</p></> : <><p className="eyebrow">CARTE ÉLÈVE</p><h1>{latestPayment ? label : "Aucun relevé"}</h1><div className="lookup-student"><strong>{result?.student.first_name} {result?.student.last_name}</strong><small>Matricule : {result?.student.student_number}</small></div>{latestPayment ? <div className="lookup-payment"><span>Mois concerné</span><strong>{new Date(latestPayment.month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</strong><span>Montant enregistré</span><strong>{Number(latestPayment.amount_paid).toLocaleString("fr-FR")} / {Number(latestPayment.amount_due).toLocaleString("fr-FR")} FCFA</strong></div> : <p>Aucun statut mensuel n’a encore été enregistré pour cet élève.</p>}<p className="lookup-note">Cette consultation se limite au statut de paiement nécessaire à la vérification d’accès.</p></>}</section></main>;
}
