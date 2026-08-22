/** Parcours d’identité Schooly — connexion, création et récupération sécurisée via Supabase Auth. */
import { hasPlatformAdminRole, supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, School, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

type AuthMode = "login" | "signup" | "forgot" | "reset";

export default function Auth() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const isPlatformEntry = searchParams.get("role") === "platform";
  const resetEntry = searchParams.get("mode") === "reset";
  const authenticatedDestination = isPlatformEntry ? "/supervision" : "/app";
  const confirmationDestination = isPlatformEntry ? "/supervision" : "/demarrer";
  const [mode, setMode] = useState<AuthMode>(resetEntry ? "reset" : isPlatformEntry ? "login" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const switchMode = (nextMode: AuthMode) => { setMode(nextMode); setStatus("idle"); setMessage(""); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/connexion?mode=reset${isPlatformEntry ? "&role=platform" : ""}` });
      if (error) { setStatus("error"); setMessage(error.message); return; }
      setStatus("success"); setMessage("Si cette adresse est enregistrée, un lien sécurisé de réinitialisation vient de lui être envoyé."); return;
    }
    if (mode === "reset") {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) { setStatus("error"); setMessage("Le lien de réinitialisation est invalide ou expiré. Demandez-en un nouveau."); return; }
      setStatus("success"); setMessage("Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter."); setPassword(""); return;
    }
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}${confirmationDestination}` } });
      if (error) { setStatus("error"); setMessage(error.status === 429 ? "Supabase limite temporairement les inscriptions. Attendez quelques minutes puis réessayez." : error.message); return; }
      if (data.session) { setLocation(authenticatedDestination); return; }
      setStatus("success"); setMessage("Votre compte a été créé. Vérifiez votre e-mail pour confirmer l’accès à Schooly."); return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setStatus("error"); setMessage(error.message); return; }
    if (isPlatformEntry && !await hasPlatformAdminRole()) { await supabase.auth.signOut(); setStatus("error"); setMessage("Ce compte ne dispose pas de l’accès super-administrateur Schooly."); return; }
    setLocation(authenticatedDestination);
  };
  const title = mode === "forgot" ? "Retrouver votre accès." : mode === "reset" ? "Choisissez un nouveau mot de passe." : isPlatformEntry ? "Supervision sécurisée." : mode === "signup" ? "Commençons simplement." : "Ravi de vous revoir.";
  const description = mode === "forgot" ? "Nous vous enverrons un lien sécurisé si cette adresse est reconnue." : mode === "reset" ? "Utilisez au minimum huit caractères que vous n’employez pas ailleurs." : isPlatformEntry ? "Connectez-vous avec l’adresse e-mail propriétaire de la plateforme." : mode === "signup" ? "Quelques informations suffisent pour préparer l’espace de votre établissement." : "Connectez-vous pour retrouver votre établissement.";
  return <div className="auth-page"><aside className="auth-aside"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><div className="auth-aside-copy"><p className="landing-eyebrow"><i /> {isPlatformEntry ? "SCHOOLY PLATFORM" : "BIENVENUE DANS SCHOOLY"}</p><h1>{isPlatformEntry ? <>Votre accès<br /><em>de supervision.</em></> : <>Le point de départ<br />de votre <em>école connectée.</em></>}</h1><p>{isPlatformEntry ? "Cet accès est réservé au super-administrateur de la plateforme. Il mène au poste de supervision multi-écoles." : "Créez votre accès, présentez votre établissement et rassemblez vos équipes autour d’un même espace."}</p><div className="auth-benefits"><div><span><School size={16} /></span><p><strong>{isPlatformEntry ? "Plateforme distincte" : "Votre établissement"}</strong><small>{isPlatformEntry ? "Aucune confusion avec le tableau de bord directeur." : "Un espace à vos couleurs, entièrement dédié."}</small></p></div><div><span><LockKeyhole size={16} /></span><p><strong>Vos accès</strong><small>Des permissions adaptées à chaque rôle.</small></p></div></div></div><div className="auth-orb auth-orb--one" /><div className="auth-orb auth-orb--two" /></aside><main className="auth-main"><button className="auth-close" onClick={() => setLocation(isPlatformEntry ? "/administration" : "/")} aria-label="Retour à l’accueil"><X size={20} /></button><section className="auth-card"><div className="auth-card-head"><p className="landing-eyebrow">{mode === "forgot" ? "RÉCUPÉRATION D’ACCÈS" : mode === "reset" ? "NOUVEAU MOT DE PASSE" : isPlatformEntry ? "SUPER-ADMINISTRATEUR" : mode === "signup" ? "CRÉER VOTRE ESPACE" : "RETOUR DANS SCHOOLY"}</p><h2>{title}</h2><p>{description}</p></div>{!isPlatformEntry && mode !== "forgot" && mode !== "reset" && <div className="auth-mode-tabs"><button className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Créer un compte</button><button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Se connecter</button></div>}<form onSubmit={handleSubmit}>{mode === "signup" && <label>Votre nom complet<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required placeholder="Ex. Aminata Seck" /></label>}{mode !== "reset" && <label>Adresse e-mail<span className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="vous@ecole.sn" /></span></label>}{mode !== "forgot" && <label>{mode === "reset" ? "Nouveau mot de passe" : "Mot de passe"}<span className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" || mode === "reset" ? "new-password" : "current-password"} minLength={8} required placeholder="8 caractères minimum" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Afficher le mot de passe">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>}{status !== "idle" && <div className={`auth-message auth-message--${status}`}>{status === "success" ? <CheckCircle2 size={17} /> : null}{message}</div>}<button className="auth-submit" disabled={status === "loading"}>{status === "loading" ? "Traitement en cours…" : mode === "forgot" ? <>Envoyer le lien <ArrowRight size={17} /></> : mode === "reset" ? <>Enregistrer le mot de passe <ArrowRight size={17} /></> : mode === "signup" ? <>Créer mon compte <ArrowRight size={17} /></> : <>{isPlatformEntry ? "Ouvrir la supervision" : "Accéder à Schooly"} <ArrowRight size={17} /></>}</button></form>{mode === "login" && <button className="auth-recovery-link" onClick={() => switchMode("forgot")}>Mot de passe oublié ?</button>}{(mode === "forgot" || mode === "reset") && <button className="auth-recovery-link" onClick={() => switchMode("login")}>Retour à la connexion</button>}<p className="auth-footnote">En continuant, vous acceptez les conditions d’utilisation de Schooly. Vos données restent séparées de celles des autres établissements.</p></section></main></div>;
}
