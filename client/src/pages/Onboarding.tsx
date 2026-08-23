/** Création du premier établissement Schooly, automatique après confirmation ou guidée pour les comptes existants. */
import { supabase } from "@/lib/supabase";
import { isSchoolySignupDraft, SCHOOL_CYCLES, SchoolySignupDraft } from "../../../shared/schoolSetup";
import { ArrowRight, Building2, Check, ChevronLeft, LoaderCircle, MapPin, School, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 52);
type SchoolContact = { address: string; phone: string; email: string };

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [userName, setUserName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState("Dakar");
  const [country, setCountry] = useState("Sénégal");
  const [slug, setSlug] = useState("");
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");
  const [automaticDraft, setAutomaticDraft] = useState<SchoolySignupDraft | null>(null);
  const [pendingContact, setPendingContact] = useState<{ schoolId: string; contact: SchoolContact } | null>(null);
  const generatedSlug = useMemo(() => slug || slugify(schoolName), [slug, schoolName]);
  const suggestedClasses = useMemo(
    () => SCHOOL_CYCLES
      .filter((option) => educationLevels.includes(option.id))
      .flatMap((option) => option.classes.map((name) => ({ level: option.label, name }))),
    [educationLevels],
  );

  const saveSchoolContactDetails = async (schoolId: string, contact: SchoolContact) => {
    const { error } = await supabase.rpc("save_school_contact_details", {
      p_school_id: schoolId,
      p_address: contact.address,
      p_contact_phone: contact.phone,
      p_contact_email: contact.email,
    });
    if (error) throw new Error("L’établissement est créé, mais ses coordonnées professionnelles n’ont pas été enregistrées. Vérifiez la migration Supabase puis réessayez.");
  };

  const createSchool = async (input: {
    name: string;
    city: string;
    country: string;
    slug: string;
    educationLevels: string[];
    classes: Array<{ level: string; name: string }>;
  }) => {
    const { data, error } = await supabase.rpc("create_school_with_owner", {
      p_name: input.name.trim(),
      p_slug: input.slug,
      p_city: input.city.trim(),
      p_country: input.country.trim(),
    });
    if (error || !data) {
      throw new Error(error?.message.includes("duplicate") ? "Ce nom de lien est déjà utilisé. Essayez une variante." : error?.message ?? "La création a échoué.");
    }
    const { error: setupError } = await supabase.rpc("save_school_setup", {
      p_school_id: (data as { id: string }).id,
      p_education_levels: input.educationLevels,
      p_suggested_classes: input.classes,
    });
    if (setupError) throw new Error("L’établissement a été créé, mais les suggestions de classes n’ont pas été enregistrées.");
    return data as { id: string };
  };

  const finishAutomaticSignup = async (draft: SchoolySignupDraft, userId: string) => {
    setAutomaticDraft(draft);
    setStatus("saving");
    const defaultSlug = slugify(draft.school.name) || "ecole";
    let schoolId: string | null = null;
    try {
      const school = await createSchool({
        name: draft.school.name,
        city: draft.school.city,
        country: draft.school.country,
        slug: `${defaultSlug}-${userId.slice(0, 6)}`,
        educationLevels: draft.educationLevels,
        classes: draft.classes.map((item) => ({ level: item.level, name: item.name })),
      });
      schoolId = school.id;
      await saveSchoolContactDetails(school.id, { address: draft.school.address, phone: draft.school.phone, email: draft.school.email });
      setPendingContact(null);
      await supabase.auth.updateUser({ data: { schooly_signup_completed_at: new Date().toISOString() } });
      setLocation("/app");
    } catch (setupError) {
      setStatus("error");
      setMessage(setupError instanceof Error ? setupError.message : "La préparation de votre établissement a échoué.");
      if (schoolId) setPendingContact({ schoolId, contact: { address: draft.school.address, phone: draft.school.phone, email: draft.school.email } });
    }
  };

  const retryPendingContact = async () => {
    if (!pendingContact) return;
    setStatus("saving");
    try {
      await saveSchoolContactDetails(pendingContact.schoolId, pendingContact.contact);
      await supabase.auth.updateUser({ data: { schooly_signup_completed_at: new Date().toISOString() } });
      setPendingContact(null);
      setLocation("/app");
    } catch (contactError) {
      setStatus("error");
      setMessage(contactError instanceof Error ? contactError.message : "Les coordonnées n’ont pas pu être enregistrées.");
    }
  };

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLocation("/connexion"); return; }
      setUserName(String(user.user_metadata.full_name ?? user.email?.split("@")[0] ?? ""));
      const { data: memberships } = await supabase.from("school_memberships").select("school_id").limit(1);
      if (memberships?.length) { setLocation("/app"); return; }

      const draft = user.user_metadata.schooly_signup;
      if (isSchoolySignupDraft(draft) && !user.user_metadata.schooly_signup_completed_at) {
        setChecking(false);
        await finishAutomaticSignup(draft, user.id);
        return;
      }
      setChecking(false);
    })();
  }, [setLocation]);

  const toggleLevel = (id: string) => setEducationLevels((current) => current.includes(id) ? current.filter((level) => level !== id) : [...current, id]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      await createSchool({
        name: schoolName,
        slug: generatedSlug,
        city,
        country,
        educationLevels,
        classes: suggestedClasses,
      });
      setLocation("/app");
    } catch (setupError) {
      setStatus("error");
      setMessage(setupError instanceof Error ? setupError.message : "La création a échoué.");
    }
  };

  if (checking) return <div className="onboarding-loading"><LoaderCircle size={25} /><span>Préparation de votre espace Schooly…</span></div>;
  if (automaticDraft) return <div className="onboarding-loading"><LoaderCircle size={25} /><strong>Bienvenue, {userName || automaticDraft.director.firstName}.</strong><span>{status === "saving" ? `Schooly crée ${automaticDraft.school.name}, ses accès et ses ${automaticDraft.classes.length} classes.` : message}</span>{status === "error" && <button className="auth-submit" onClick={() => pendingContact ? void retryPendingContact() : void finishAutomaticSignup(automaticDraft, "retry")}>Réessayer</button>}</div>;

  return <div className="onboarding-page"><header className="onboarding-nav"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><div className="onboarding-progress"><span className="progress-step progress-step--active">1</span><i /><span className="progress-step">2</span><i /><span className="progress-step">3</span><small>Votre établissement</small></div><span className="onboarding-user">Bonjour, {userName || "à vous"}</span></header><main className="onboarding-content"><section className="onboarding-intro"><p className="landing-eyebrow"><i /> PREMIÈRE ÉTAPE</p><h1>Présentons<br /><em>votre établissement.</em></h1><p>Schooly vous suggère une structure de départ. Vous pourrez toujours créer, renommer ou supprimer vos propres classes ensuite.</p><div className="onboarding-note"><span><Sparkles size={18} /></span><p><strong>Pas d’université dans le socle initial</strong><small>Les facultés et semestres suivront dans un parcours dédié, sans compliquer la configuration des écoles.</small></p></div></section><section className="onboarding-form-card"><div className="onboarding-icon"><Building2 size={23} /></div><h2>Informations principales</h2><p>Ces données identifient votre établissement et préparent sa structure.</p><form onSubmit={submit}><label>Nom de l’établissement<input value={schoolName} onChange={(event) => { setSchoolName(event.target.value); if (!slug) setSlug(""); }} required placeholder="Ex. École Horizon" /></label><label>Lien de votre espace<span className="onboarding-slug"><i>schooly.app/</i><input value={generatedSlug} onChange={(event) => setSlug(slugify(event.target.value))} required placeholder="ecole-horizon" /></span><small>Utilisez des lettres, chiffres et tirets uniquement.</small></label><div className="onboarding-row"><label><span><MapPin size={15} /> Ville</span><input value={city} onChange={(event) => setCity(event.target.value)} required /></label><label>Pays<select value={country} onChange={(event) => setCountry(event.target.value)}><option>Sénégal</option><option>Côte d’Ivoire</option><option>Mali</option><option>Guinée</option><option>Autre</option></select></label></div><div className="setup-levels"><strong>Quels niveaux accueillez-vous ?</strong><p>Choisissez les suggestions utiles ; elles restent modifiables.</p>{SCHOOL_CYCLES.map((option) => <button type="button" className={educationLevels.includes(option.id) ? "setup-level setup-level--active" : "setup-level"} key={option.id} onClick={() => toggleLevel(option.id)}><span>{educationLevels.includes(option.id) ? <Check size={15} /> : null}</span><div><b>{option.label}</b><small>{option.detail}</small></div></button>)}</div>{suggestedClasses.length ? <div className="setup-summary"><strong>Suggestions préparées</strong><span>{suggestedClasses.map((item) => item.name).join(" · ")}</span></div> : null}{status === "error" && <div className="onboarding-error">{message}</div>}<button className="auth-submit" disabled={status === "saving" || !schoolName || !generatedSlug}>{status === "saving" ? "Création de l’espace…" : <>Créer mon établissement <ArrowRight size={17} /></>}</button></form><button className="onboarding-back" onClick={() => setLocation("/")}><ChevronLeft size={16} /> Retour à l’accueil</button></section></main></div>;
}
