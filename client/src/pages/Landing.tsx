/**
 * Design Campus Graphique — page publique conçue comme la porte d’entrée
 * institutionnelle vers le SaaS Schooly et ses espaces multi-écoles.
 */
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  Menu,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => { void (async () => { const { data: { session } } = await supabase.auth.getSession(); setIsAuthenticated(Boolean(session)); setLoading(false); })(); }, []);
  const launchWorkspace = () => {
    if (isAuthenticated) {
      setLocation("/app");
      return;
    }
    setLocation("/connexion");
  };
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="landing-brand" onClick={() => setLocation("/")} aria-label="Accueil Schooly">
          <img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" />
          <span>schooly</span>
        </button>
        <nav className={mobileOpen ? "landing-links landing-links--open" : "landing-links"} aria-label="Navigation principale">
          <button onClick={launchWorkspace}>Espace établissement</button>
          <button onClick={() => setLocation("/administration")}>Plateforme</button>
          <button className="mobile-workspace-link" onClick={launchWorkspace}>Mon espace <ArrowRight size={15} /></button>
        </nav>
        <div className="landing-nav-actions">
          <button className="landing-login platform-link" onClick={() => setLocation("/administration")}>Administration</button>
          <button className="landing-login" onClick={launchWorkspace} disabled={loading}>{isAuthenticated ? "Mon espace" : "Se connecter"}</button>
          <button className="landing-cta landing-cta--compact" onClick={launchWorkspace} disabled={loading}>Créer mon espace <ArrowRight size={15} /></button>
        </div>
        <button className="landing-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Ouvrir le menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow"><i /> PLATEFORME DE GESTION SCOLAIRE</div>
            <h1>Une école mieux<br /><em>organisée.</em></h1>
            <p>Créez, pilotez et développez votre établissement dans un espace unique, conçu pour votre direction et votre équipe.</p>
            <div className="landing-hero-actions">
              <button className="landing-cta" onClick={launchWorkspace} disabled={loading}>{isAuthenticated ? "Accéder à mon espace" : "Créer l’espace de mon école"}<ArrowRight size={17} /></button>
              <button className="landing-secondary" onClick={() => setLocation("/administration")}>Accès plateforme <ArrowRight size={16} /></button>
            </div>
            <div className="landing-trust-row"><span><BadgeCheck size={16} /> Multi-écoles</span><span><ShieldCheck size={16} /> Accès par rôle</span><span><LockKeyhole size={16} /> Données protégées</span></div>
          </div>
          <div className="landing-hero-art" aria-label="Vue de campus scolaire">
            <div className="landing-orbit landing-orbit--one" /><div className="landing-orbit landing-orbit--two" />
            <div className="landing-float-card landing-float-card--bottom"><span className="float-icon"><UsersRound size={17} /></span><div><strong>Votre école</strong><small>Votre espace, vos règles</small></div></div>
          </div>
        </section>
      </main>
      <footer className="landing-footer"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><p>La plateforme tout-en-un pour gérer simplement votre établissement.</p><span>© 2026 Schooly</span></footer>
    </div>
  );
}
