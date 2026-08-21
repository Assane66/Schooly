/**
 * Design Campus Graphique — page publique conçue comme la porte d’entrée
 * institutionnelle vers le SaaS Schooly et ses espaces multi-écoles.
 */
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  School,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const modules = [
  ["Élèves & inscriptions", "Dossiers, matricules, familles et historique scolaire.", UsersRound, "#dfe7ff"],
  ["Pédagogie", "Classes, évaluations, notes, moyennes et bulletins.", GraduationCap, "#e8f5ed"],
  ["Finances", "Échéances, reçus, impayés et pilotage des encaissements.", FileCheck2, "#fff0df"],
];

const benefits = [
  "Un espace sécurisé pour chaque établissement",
  "Des rôles précis pour direction, enseignants et parents",
  "Des données cohérentes, accessibles et prêtes à piloter",
];

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
  const goToProduct = () => {
    document.getElementById("produit")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="landing-brand" onClick={() => setLocation("/")} aria-label="Accueil Schooly">
          <img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" />
          <span>schooly</span>
        </button>
        <nav className={mobileOpen ? "landing-links landing-links--open" : "landing-links"} aria-label="Navigation principale">
          <button onClick={goToProduct}>Produit</button>
          <button onClick={() => document.getElementById("securite")?.scrollIntoView({ behavior: "smooth" })}>Sécurité</button>
          <button onClick={() => document.getElementById("demarrer")?.scrollIntoView({ behavior: "smooth" })}>Pour les établissements</button>
          <button className="mobile-workspace-link" onClick={launchWorkspace}>Mon espace <ArrowRight size={15} /></button>
        </nav>
        <div className="landing-nav-actions">
          <button className="landing-login" onClick={launchWorkspace} disabled={loading}>{isAuthenticated ? "Mon espace" : "Se connecter"}</button>
          <button className="landing-cta landing-cta--compact" onClick={launchWorkspace} disabled={loading}>Créer mon espace <ArrowRight size={15} /></button>
        </div>
        <button className="landing-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Ouvrir le menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow"><i /> PLATEFORME DE GESTION SCOLAIRE</div>
            <h1>Votre établissement,<br /><em>au même endroit.</em></h1>
            <p>Schooly relie les équipes, les élèves et les familles dans un espace de gestion scolaire clair, sécurisé et pensé pour accompagner la croissance de votre établissement.</p>
            <div className="landing-hero-actions">
              <button className="landing-cta" onClick={launchWorkspace} disabled={loading}>{isAuthenticated ? "Accéder à mon espace" : "Créer l’espace de mon école"}<ArrowRight size={17} /></button>
              <button className="landing-secondary" onClick={goToProduct}>Découvrir Schooly <ChevronRight size={16} /></button>
            </div>
            <div className="landing-trust-row"><span><BadgeCheck size={16} /> Multi-écoles</span><span><ShieldCheck size={16} /> Accès par rôle</span><span><LockKeyhole size={16} /> Données protégées</span></div>
          </div>
          <div className="landing-hero-art" aria-label="Vue de campus scolaire">
            <div className="landing-photo-label"><span>01</span><div><strong>ÉCOLE HORIZON</strong><small>Dakar · Sénégal</small></div></div>
            <div className="landing-orbit landing-orbit--one" /><div className="landing-orbit landing-orbit--two" />
            <div className="landing-float-card landing-float-card--top"><span className="float-icon"><UsersRound size={17} /></span><div><strong>1 284</strong><small>élèves accompagnés</small></div></div>
            <div className="landing-float-card landing-float-card--bottom"><span className="float-icon float-icon--green"><BadgeCheck size={17} /></span><div><strong>94,2 %</strong><small>présence aujourd’hui</small></div></div>
          </div>
        </section>

        <section className="landing-proof" aria-label="Éléments de confiance">
          <div><span className="proof-number">01</span><p>Une plateforme structurée pour<br /><strong>toutes les opérations scolaires.</strong></p></div>
          <span className="proof-rule" />
          <div><span className="proof-icon"><Building2 size={20} /></span><p>Chaque école dispose de<br /><strong>son espace isolé.</strong></p></div>
          <span className="proof-rule" />
          <div><span className="proof-icon"><Sparkles size={20} /></span><p>Les équipes passent moins de temps<br /><strong>à chercher, plus à accompagner.</strong></p></div>
        </section>

        <section id="produit" className="landing-product">
          <div className="landing-section-head"><div><p className="landing-eyebrow"><i /> UNE BASE COMMUNE</p><h2>Gérer le quotidien.<br /><em>Suivre l’essentiel.</em></h2></div><p>De l’inscription au bulletin, Schooly rassemble les données et les tâches qui font vivre un établissement.</p></div>
          <div className="module-grid">{modules.map(([title, description, Icon, color], index) => { const ModuleIcon = Icon as typeof UsersRound; return <article key={title as string} className="landing-module"><span className="module-index">0{index + 1}</span><span className="module-icon" style={{ background: color as string }}><ModuleIcon size={22} /></span><h3>{title as string}</h3><p>{description as string}</p><button onClick={launchWorkspace}>Explorer <ArrowRight size={15} /></button></article>; })}</div>
        </section>

        <section id="securite" className="landing-security">
          <div className="security-panel"><div className="security-emblem"><ShieldCheck size={32} /></div><p className="landing-eyebrow">CONÇU POUR LA CONFIANCE</p><h2>Vos données restent<br /><em>à leur juste place.</em></h2><p>Schooly est pensé pour séparer les établissements, attribuer les bons accès et rendre l’information utile à chaque profil.</p><ul>{benefits.map((benefit) => <li key={benefit}><Check size={16} />{benefit}</li>)}</ul></div>
          <div className="security-cards"><article><span>ACCÈS</span><strong>Direction · Administration · Enseignants · Parents</strong><p>Chaque personne voit uniquement ce qui lui est nécessaire.</p></article><article><span>STRUCTURE</span><strong>Une école, un espace</strong><p>Les données de chaque établissement sont organisées et cloisonnées.</p></article><article><span>CONTINUITÉ</span><strong>Une histoire scolaire conservée</strong><p>Les inscriptions annuelles enrichissent le parcours de chaque élève.</p></article></div>
        </section>

        <section id="demarrer" className="landing-final-cta"><div className="landing-final-background" /><div><p className="landing-eyebrow"><i /> DÉMARREZ AVEC SCHOOLY</p><h2>Un établissement plus serein<br />commence par <em>un meilleur repère.</em></h2><p>Créez votre espace, présentez votre école et choisissez les premiers membres de votre équipe.</p><button className="landing-cta" onClick={launchWorkspace} disabled={loading}>{isAuthenticated ? "Ouvrir mon tableau de bord" : "Créer l’espace de mon école"}<ArrowRight size={17} /></button></div><div className="final-mark"><School size={32} /><span>Schooly<br />2026</span></div></section>
      </main>
      <footer className="landing-footer"><button className="landing-brand" onClick={() => setLocation("/")}><img src="/manus-storage/schooly-s-mark_1ed993f5.png" alt="" /><span>schooly</span></button><p>La plateforme tout-en-un pour gérer simplement votre établissement.</p><span>© 2026 Schooly</span></footer>
    </div>
  );
}
