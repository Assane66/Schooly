/** Inscription, connexion et récupération Schooly via Supabase Auth. */
import { hasPlatformAdminRole, supabase } from "@/lib/supabase";
import { buildSchoolyAuthEmailRedirect } from "../../../shared/supabaseAuthUrls";
import {
  SCHOOL_CYCLES,
  SchoolClassDraft,
  SchoolCycleId,
  SchoolySignupDraft,
  syncClassesForCycles,
} from "../../../shared/schoolSetup";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Plus,
  School,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";

type AuthMode = "login" | "signup" | "forgot" | "reset";
type SignupStep = 1 | 2 | 3 | 4;

const emptySignupDraft: SchoolySignupDraft = {
  director: { firstName: "", lastName: "", phone: "", address: "", city: "", country: "Sénégal" },
  school: { name: "", phone: "", email: "", address: "", city: "", country: "Sénégal" },
  educationLevels: [],
  classes: [],
};

function draftFullName(draft: SchoolySignupDraft) {
  return `${draft.director.firstName.trim()} ${draft.director.lastName.trim()}`.trim();
}

export default function Auth() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const isPlatformEntry = searchParams.get("role") === "platform";
  const resetEntry = searchParams.get("mode") === "reset";
  const confirmationEntry = searchParams.get("mode") === "confirm";
  const [mode, setMode] = useState<AuthMode>(
    resetEntry ? "reset" : isPlatformEntry || confirmationEntry ? "login" : "signup",
  );
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [signupDraft, setSignupDraft] = useState<SchoolySignupDraft>(emptySignupDraft);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCycle, setNewClassCycle] = useState<SchoolCycleId>("primary");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);

  const getEmailRedirect = (flow: "confirm" | "reset") =>
    buildSchoolyAuthEmailRedirect(window.location.origin, flow, isPlatformEntry);

  const resolveDestination = async (userId: string) => {
    if (isPlatformEntry) return "/supervision";
    const { data: memberships } = await supabase
      .from("school_memberships")
      .select("role")
      .eq("user_id", userId)
      .limit(1);
    if (memberships?.some((membership) => membership.role === "student" || membership.role === "parent")) return "/famille";
    return memberships?.length ? "/app" : "/demarrer";
  };

  useEffect(() => {
    if (!confirmationEntry) return;
    void (async () => {
      setStatus("loading");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("error");
        setMessage("La confirmation est terminée. Connectez-vous maintenant avec votre adresse et votre mot de passe.");
        return;
      }
      setLocation(await resolveDestination(user.id));
    })();
  }, [confirmationEntry, setLocation]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setSignupStep(1);
    setStatus("idle");
    setMessage("");
  };

  const setDirector = (field: keyof SchoolySignupDraft["director"], value: string) => {
    setSignupDraft((current) => ({ ...current, director: { ...current.director, [field]: value } }));
  };

  const setSchool = (field: keyof SchoolySignupDraft["school"], value: string) => {
    setSignupDraft((current) => ({ ...current, school: { ...current.school, [field]: value } }));
  };

  const toggleCycle = (cycleId: SchoolCycleId) => {
    setSignupDraft((current) => {
      const educationLevels = current.educationLevels.includes(cycleId)
        ? current.educationLevels.filter((item) => item !== cycleId)
        : [...current.educationLevels, cycleId];
      return { ...current, educationLevels, classes: syncClassesForCycles(current.classes, educationLevels) };
    });
  };

  const updateClass = (id: string, name: string) => {
    setSignupDraft((current) => ({
      ...current,
      classes: current.classes.map((item) => (item.id === id ? { ...item, name } : item)),
    }));
  };

  const removeClass = (id: string) => {
    setSignupDraft((current) => ({ ...current, classes: current.classes.filter((item) => item.id !== id) }));
  };

  const addClass = () => {
    const name = newClassName.trim();
    if (!name || !signupDraft.educationLevels.includes(newClassCycle)) return;
    const cycle = SCHOOL_CYCLES.find((item) => item.id === newClassCycle);
    if (!cycle) return;
    const id = `custom-${newClassCycle}-${crypto.randomUUID()}`;
    const item: SchoolClassDraft = { id, cycleId: newClassCycle, level: cycle.label, name };
    setSignupDraft((current) => ({ ...current, classes: [...current.classes, item] }));
    setNewClassName("");
  };

  const validateSignupStep = (step: SignupStep) => {
    if (step === 1 && (!signupDraft.director.firstName.trim() || !signupDraft.director.lastName.trim() || !signupDraft.director.phone.trim() || !signupDraft.director.address.trim() || !signupDraft.director.city.trim() || !email.trim())) {
      return "Complétez les coordonnées du directeur avant de continuer.";
    }
    if (step === 2 && (!signupDraft.school.name.trim() || !signupDraft.school.address.trim() || !signupDraft.school.city.trim())) {
      return "Ajoutez le nom et la localisation de l’établissement avant de continuer.";
    }
    if (step === 3 && (!signupDraft.educationLevels.length || !signupDraft.classes.filter((item) => item.name.trim()).length)) {
      return "Sélectionnez au moins un cycle et conservez au moins une classe.";
    }
    if (step === 4 && password.length < 8) return "Choisissez un mot de passe d’au moins huit caractères.";
    return null;
  };

  const goToNextSignupStep = () => {
    const validationError = validateSignupStep(signupStep);
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }
    setStatus("idle");
    setMessage("");
    setSignupStep((current) => Math.min(4, current + 1) as SignupStep);
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    setIsResendingConfirmation(true);
    setStatus("loading");
    setMessage("");
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: getEmailRedirect("confirm") },
      });
      if (error) {
        setStatus("error");
        setMessage(error.status === 429 ? "Un lien vient déjà d’être demandé. Attendez au moins une minute avant de réessayer." : error.message);
        return;
      }
      setStatus("success");
      setMessage("Un nouveau lien de confirmation vient d’être demandé. Vérifiez votre boîte de réception et les indésirables.");
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: getEmailRedirect("reset") });
      if (error) { setStatus("error"); setMessage(error.message); return; }
      setStatus("success");
      setMessage("Si cette adresse est enregistrée, un lien sécurisé de réinitialisation vient de lui être envoyé.");
      return;
    }

    if (mode === "reset") {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setStatus("error"); setMessage("Le lien de réinitialisation est invalide ou expiré. Demandez-en un nouveau."); return; }
      setStatus("success");
      setMessage("Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.");
      setPassword("");
      return;
    }

    if (mode === "signup") {
      const validationError = validateSignupStep(signupStep);
      if (validationError) { setStatus("error"); setMessage(validationError); return; }
      if (signupStep < 4) { setStatus("idle"); goToNextSignupStep(); return; }
      const completedDraft: SchoolySignupDraft = {
        ...signupDraft,
        classes: signupDraft.classes.filter((item) => item.name.trim()).map((item) => ({ ...item, name: item.name.trim() })),
      };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: draftFullName(completedDraft),
            director_phone: completedDraft.director.phone.trim(),
            director_address: completedDraft.director.address.trim(),
            director_city: completedDraft.director.city.trim(),
            director_country: completedDraft.director.country.trim(),
            schooly_signup: completedDraft,
          },
          emailRedirectTo: getEmailRedirect("confirm"),
        },
      });
      if (error) {
        setStatus("error");
        setMessage(error.status === 429 ? "Trop de demandes de confirmation ont été envoyées. Attendez une heure avant de réessayer ou utilisez une autre adresse de test." : error.message);
        return;
      }
      if (data.session) { setLocation(await resolveDestination(data.session.user.id)); return; }
      setStatus("success");
      setMessage("Votre compte est prêt. Confirmez votre adresse e-mail : Schooly créera ensuite votre espace et vos classes sélectionnées.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setStatus("error"); setMessage(error.message); return; }
    if (isPlatformEntry && !(await hasPlatformAdminRole())) {
      await supabase.auth.signOut();
      setStatus("error");
      setMessage("Ce compte ne dispose pas de l’accès super-administrateur Schooly.");
      return;
    }
    setLocation(await resolveDestination(data.user.id));
  };

  const title = mode === "forgot" ? "Retrouver votre accès." : mode === "reset" ? "Choisissez un nouveau mot de passe." : isPlatformEntry ? "Supervision sécurisée." : mode === "signup" ? "Préparez votre école." : "Ravi de vous revoir.";
  const description = mode === "forgot" ? "Nous vous enverrons un lien sécurisé si cette adresse est reconnue." : mode === "reset" ? "Utilisez au minimum huit caractères que vous n’employez pas ailleurs." : isPlatformEntry ? "Connectez-vous avec l’adresse e-mail propriétaire de la plateforme." : mode === "signup" ? "En quatre étapes, nous préparons les accès, l’établissement et les premières classes." : "Connectez-vous pour retrouver votre établissement.";

  const renderStatus = () => status !== "idle" ? <div className={`auth-message auth-message--${status}`}>{status === "success" ? <CheckCircle2 size={17} /> : null}{message}</div> : null;

  const renderSignupStep = () => {
    if (signupStep === 1) return <div className="signup-step-content"><div className="signup-step-heading"><span className="signup-step-icon"><UserRound size={18} /></span><div><h3>Le directeur de l’établissement</h3><p>Ces coordonnées restent rattachées à votre compte personnel.</p></div></div><div className="signup-grid"><label>Prénom<input value={signupDraft.director.firstName} onChange={(event) => setDirector("firstName", event.target.value)} autoComplete="given-name" required placeholder="Ex. Aminata" /></label><label>Nom<input value={signupDraft.director.lastName} onChange={(event) => setDirector("lastName", event.target.value)} autoComplete="family-name" required placeholder="Ex. Diallo" /></label></div><label>Numéro de téléphone<span className="input-wrap"><Phone size={17} /><input type="tel" value={signupDraft.director.phone} onChange={(event) => setDirector("phone", event.target.value)} autoComplete="tel" required placeholder="Ex. +221 77 000 00 00" /></span></label><label>Adresse e-mail<span className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="vous@ecole.sn" /></span></label><label>Adresse personnelle<input value={signupDraft.director.address} onChange={(event) => setDirector("address", event.target.value)} autoComplete="street-address" required placeholder="Quartier, rue ou repère" /></label><div className="signup-grid"><label>Ville / localisation<input value={signupDraft.director.city} onChange={(event) => setDirector("city", event.target.value)} autoComplete="address-level2" required placeholder="Ex. Dakar" /></label><label>Pays<select value={signupDraft.director.country} onChange={(event) => setDirector("country", event.target.value)}><option>Sénégal</option><option>Côte d’Ivoire</option><option>Mali</option><option>Guinée</option><option>Autre</option></select></label></div></div>;
    if (signupStep === 2) return <div className="signup-step-content"><div className="signup-step-heading"><span className="signup-step-icon"><Building2 size={18} /></span><div><h3>Votre établissement</h3><p>Les coordonnées affichées aux familles et à votre équipe.</p></div></div><label>Nom de l’établissement<input value={signupDraft.school.name} onChange={(event) => setSchool("name", event.target.value)} required placeholder="Ex. École Horizon" /></label><div className="signup-grid"><label>Numéro professionnel <small>Facultatif</small><span className="input-wrap"><Phone size={17} /><input type="tel" value={signupDraft.school.phone} onChange={(event) => setSchool("phone", event.target.value)} placeholder="Ex. +221 33 000 00 00" /></span></label><label>E-mail professionnel <small>Facultatif</small><span className="input-wrap"><Mail size={17} /><input type="email" value={signupDraft.school.email} onChange={(event) => setSchool("email", event.target.value)} placeholder="contact@ecole.sn" /></span></label></div><label>Adresse de l’établissement<input value={signupDraft.school.address} onChange={(event) => setSchool("address", event.target.value)} required placeholder="Quartier, rue ou repère" /></label><div className="signup-grid"><label>Ville / localisation<span className="input-wrap"><MapPin size={17} /><input value={signupDraft.school.city} onChange={(event) => setSchool("city", event.target.value)} required placeholder="Ex. Thiès" /></span></label><label>Pays<select value={signupDraft.school.country} onChange={(event) => setSchool("country", event.target.value)}><option>Sénégal</option><option>Côte d’Ivoire</option><option>Mali</option><option>Guinée</option><option>Autre</option></select></label></div></div>;
    if (signupStep === 3) return <div className="signup-step-content"><div className="signup-step-heading"><span className="signup-step-icon"><School size={18} /></span><div><h3>Cycles et premières classes</h3><p>Choisissez les cycles utiles. Chaque classe proposée peut être renommée, supprimée ou complétée.</p></div></div><div className="signup-cycles">{SCHOOL_CYCLES.map((cycle) => <button type="button" className={signupDraft.educationLevels.includes(cycle.id) ? "signup-cycle signup-cycle--selected" : "signup-cycle"} onClick={() => toggleCycle(cycle.id)} key={cycle.id}><span>{signupDraft.educationLevels.includes(cycle.id) && <Check size={15} />}</span><div><strong>{cycle.label}</strong><small>{cycle.detail}</small></div></button>)}</div>{signupDraft.educationLevels.length > 0 && <div className="signup-classes"><div className="signup-classes-head"><div><strong>Classes de départ</strong><small>{signupDraft.classes.length} classe{signupDraft.classes.length > 1 ? "s" : ""} préparée{signupDraft.classes.length > 1 ? "s" : ""}</small></div></div><div className="signup-class-list">{signupDraft.classes.map((item) => <div className="signup-class-row" key={item.id}><span>{item.level}</span><input value={item.name} onChange={(event) => updateClass(item.id, event.target.value)} aria-label={`Nom de la classe ${item.name}`} /><button type="button" onClick={() => removeClass(item.id)} aria-label={`Supprimer ${item.name}`}><Trash2 size={16} /></button></div>)}</div><div className="signup-add-class"><select value={newClassCycle} onChange={(event) => setNewClassCycle(event.target.value as SchoolCycleId)}>{signupDraft.educationLevels.map((id) => <option key={id} value={id}>{SCHOOL_CYCLES.find((cycle) => cycle.id === id)?.label}</option>)}</select><input value={newClassName} onChange={(event) => setNewClassName(event.target.value)} placeholder="Ajouter une classe" /><button type="button" onClick={addClass} disabled={!newClassName.trim()}><Plus size={16} /> Ajouter</button></div></div>}</div>;
    return <div className="signup-step-content"><div className="signup-step-heading"><span className="signup-step-icon"><KeyRound size={18} /></span><div><h3>Sécurisez votre accès</h3><p>Après confirmation de votre e-mail, votre espace {signupDraft.school.name || "Schooly"} sera créé automatiquement.</p></div></div><div className="signup-review"><p><UserRound size={16} /><span><strong>{draftFullName(signupDraft)}</strong><small>{email || "Adresse e-mail à confirmer"}</small></span></p><p><Building2 size={16} /><span><strong>{signupDraft.school.name || "Votre établissement"}</strong><small>{signupDraft.classes.length} classe{signupDraft.classes.length > 1 ? "s" : ""} sélectionnée{signupDraft.classes.length > 1 ? "s" : ""}</small></span></p></div><label>Créer un mot de passe<span className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required placeholder="8 caractères minimum" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Afficher le mot de passe">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label><p className="signup-confirmation-note"><CheckCircle2 size={16} /> Vous recevrez ensuite un e-mail de confirmation. Après validation, Schooly créera votre espace puis vous guidera vers vos premiers élèves, professeurs, calendriers et notes.</p></div>;
  };

  return <div className="auth-page"><aside className="auth-aside"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><div className="auth-aside-copy"><p className="landing-eyebrow"><i /> {isPlatformEntry ? "SCHOOLY PLATFORM" : "BIENVENUE DANS SCHOOLY"}</p><h1>{isPlatformEntry ? <>Votre accès<br /><em>de supervision.</em></> : mode === "signup" ? <>Votre école,<br /><em>prête à démarrer.</em></> : <>Le point de départ<br />de votre <em>école connectée.</em></>}</h1><p>{isPlatformEntry ? "Cet accès est réservé au super-administrateur de la plateforme. Il mène au poste de supervision multi-écoles." : "Une inscription claire pour préparer l’établissement, ses classes et les accès de son équipe."}</p><div className="auth-benefits"><div><span><School size={16} /></span><p><strong>Élémentaire, collège, lycée</strong><small>Des classes de départ adaptées à vos cycles.</small></p></div><div><span><LockKeyhole size={16} /></span><p><strong>Vos accès</strong><small>Un e-mail de confirmation sécurise la création.</small></p></div></div></div><div className="auth-orb auth-orb--one" /><div className="auth-orb auth-orb--two" /></aside><main className="auth-main"><button className="auth-close" onClick={() => setLocation(isPlatformEntry ? "/administration" : "/")} aria-label="Retour à l’accueil"><X size={20} /></button><section className={`auth-card ${mode === "signup" ? "auth-card--wizard" : ""}`}><div className="auth-card-head"><p className="landing-eyebrow">{mode === "forgot" ? "RÉCUPÉRATION D’ACCÈS" : mode === "reset" ? "NOUVEAU MOT DE PASSE" : isPlatformEntry ? "SUPER-ADMINISTRATEUR" : mode === "signup" ? `CRÉATION D’ÉTABLISSEMENT · ÉTAPE ${signupStep}/4` : "RETOUR DANS SCHOOLY"}</p><h2>{title}</h2><p>{description}</p></div>{!isPlatformEntry && mode !== "forgot" && mode !== "reset" && <div className="auth-mode-tabs"><button className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Créer un établissement</button><button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Se connecter</button></div>}{mode === "signup" ? <><div className="signup-progress" aria-label={`Étape ${signupStep} sur 4`}><span className={signupStep >= 1 ? "active" : ""}>1<i>Directeur</i></span><b /><span className={signupStep >= 2 ? "active" : ""}>2<i>École</i></span><b /><span className={signupStep >= 3 ? "active" : ""}>3<i>Classes</i></span><b /><span className={signupStep >= 4 ? "active" : ""}>4<i>Accès</i></span></div><form onSubmit={handleSubmit}>{renderSignupStep()}{renderStatus()}<div className="signup-actions">{signupStep > 1 ? <button type="button" className="signup-back" onClick={() => { setStatus("idle"); setMessage(""); setSignupStep((current) => (current - 1) as SignupStep); }}><ArrowLeft size={16} /> Précédent</button> : <span />}{signupStep < 4 ? <button type="button" className="auth-submit" onClick={goToNextSignupStep}>Suivant <ChevronRight size={17} /></button> : <button className="auth-submit" disabled={status === "loading"}>{status === "loading" ? "Préparation du compte…" : <>Terminer et recevoir l’e-mail <ArrowRight size={17} /></>}</button>}</div></form>{status === "success" && email && <button className="auth-recovery-link" type="button" disabled={isResendingConfirmation} onClick={handleResendConfirmation}>{isResendingConfirmation ? "Envoi en cours…" : "Renvoyer le lien de confirmation"}</button>}</> : <form onSubmit={handleSubmit}>{mode !== "reset" && <label>Adresse e-mail<span className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="vous@ecole.sn" /></span></label>}{mode !== "forgot" && <label>{mode === "reset" ? "Nouveau mot de passe" : "Mot de passe"}<span className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "reset" ? "new-password" : "current-password"} minLength={8} required placeholder="8 caractères minimum" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Afficher le mot de passe">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>}{renderStatus()}<button className="auth-submit" disabled={status === "loading"}>{status === "loading" ? "Traitement en cours…" : mode === "forgot" ? <>Envoyer le lien <ArrowRight size={17} /></> : mode === "reset" ? <>Enregistrer le mot de passe <ArrowRight size={17} /></> : <>{isPlatformEntry ? "Ouvrir la supervision" : "Accéder à Schooly"} <ArrowRight size={17} /></>}</button></form>}{mode === "login" && <button className="auth-recovery-link" onClick={() => switchMode("forgot")}>Mot de passe oublié ?</button>}{(mode === "forgot" || mode === "reset") && <button className="auth-recovery-link" onClick={() => switchMode("login")}>Retour à la connexion</button>}<p className="auth-footnote">En continuant, vous acceptez les conditions d’utilisation de Schooly. Vos données restent séparées de celles des autres établissements.</p></section></main></div>;
}
