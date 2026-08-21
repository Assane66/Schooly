/**
 * Parcours d’identité Schooly — connexion et création de compte via Supabase Auth.
 */
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, School, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

export default function Auth() {
  const [, setLocation] = useLocation();
  const isPlatformEntry = new URLSearchParams(window.location.search).get("role") === "platform";
  const authenticatedDestination = isPlatformEntry ? "/supervision" : "/app";
  const confirmationDestination = isPlatformEntry ? "/supervision" : "/demarrer";
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}${confirmationDestination}` },
      });
      if (error) { setStatus("error"); setMessage(error.status === 429 ? "Supabase limite temporairement les inscriptions. Attendez quelques minutes puis réessayez : le rôle de super-administrateur sera activé automatiquement." : error.message); return; }
      if (data.session) { setLocation(authenticatedDestination); return; }
      setStatus("success");
      setMessage("Votre compte a été créé. Vérifiez votre e-mail pour confirmer l’accès à Schooly.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setStatus("error"); setMessage(error.message); return; }
    setLocation(authenticatedDestination);
  };

  return <div className="auth-page"><aside className="auth-aside"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><div className="auth-aside-copy"><p className="landing-eyebrow"><i /> {isPlatformEntry ? "SCHOOLY PLATFORM" : "BIENVENUE DANS SCHOOLY"}</p><h1>{isPlatformEntry ? <>Votre accès<br /><em>de supervision.</em></> : <>Le point de départ<br />de votre <em>école connectée.</em></>}</h1><p>{isPlatformEntry ? "Cet accès est réservé au super-administrateur de la plateforme. Il mène au poste de supervision multi-écoles." : "Créez votre accès, présentez votre établissement et rassemblez vos équipes autour d’un même espace."}</p><div className="auth-benefits"><div><span><School size={16} /></span><p><strong>{isPlatformEntry ? "Plateforme distincte" : "Votre établissement"}</strong><small>{isPlatformEntry ? "Aucune confusion avec le tableau de bord directeur." : "Un espace à vos couleurs, entièrement dédié."}</small></p></div><div><span><LockKeyhole size={16} /></span><p><strong>Vos accès</strong><small>Des permissions adaptées à chaque rôle.</small></p></div></div></div><div className="auth-orb auth-orb--one" /><div className="auth-orb auth-orb--two" /></aside><main className="auth-main"><button className="auth-close" onClick={() => setLocation(isPlatformEntry ? "/administration" : "/")} aria-label="Retour à l’accueil"><X size={20} /></button><section className="auth-card"><div className="auth-card-head"><p className="landing-eyebrow">{isPlatformEntry ? "SUPER-ADMINISTRATEUR" : mode === "signup" ? "CRÉER VOTRE ESPACE" : "RETOUR DANS SCHOOLY"}</p><h2>{isPlatformEntry ? "Supervision sécurisée." : mode === "signup" ? "Commençons simplement." : "Ravi de vous revoir."}</h2><p>{isPlatformEntry ? "Connectez-vous avec l’adresse e-mail propriétaire de la plateforme." : mode === "signup" ? "Quelques informations suffisent pour préparer l’espace de votre établissement." : "Connectez-vous pour retrouver votre établissement."}</p></div><div className="auth-mode-tabs"><button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setStatus("idle"); }}>Créer un compte</button><button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setStatus("idle"); }}>Se connecter</button></div><form onSubmit={handleSubmit}>{mode === "signup" && <label>Votre nom complet<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required placeholder="Ex. Aminata Seck" /></label>}<label>Adresse e-mail<span className="input-wrap"><Mail size={17} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="vous@ecole.sn" /></span></label><label>Mot de passe<span className="input-wrap"><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required placeholder="8 caractères minimum" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Afficher le mot de passe">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{status !== "idle" && <div className={`auth-message auth-message--${status}`}>{status === "success" ? <CheckCircle2 size={17} /> : null}{message}</div>}<button className="auth-submit" disabled={status === "loading"}>{status === "loading" ? "Connexion en cours…" : mode === "signup" ? <>Créer mon compte <ArrowRight size={17} /></> : <>{isPlatformEntry ? "Ouvrir la supervision" : "Accéder à Schooly"} <ArrowRight size={17} /></>}</button></form><p className="auth-footnote">En continuant, vous acceptez les conditions d’utilisation de Schooly. Vos données restent séparées de celles des autres établissements.</p></section></main></div>;
}
