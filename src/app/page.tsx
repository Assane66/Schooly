'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, Sparkles, CheckCircle2, ShieldCheck, QrCode, 
  CreditCard, GraduationCap, Users, ArrowRight, Check, HelpCircle, 
  PhoneCall, Zap, Lock, Globe
} from 'lucide-react';
import { useAppStore } from '@/lib/store/use-app-store';

export default function LandingPage() {
  const { plans } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">EduSaaS<span className="text-sky-400">Afrique</span></span>
              <span className="block text-[10px] text-slate-400">Plateforme Multi-Écoles v1.0</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-sky-400 transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-sky-400 transition-colors">Tarifs & Abonnements</a>
            <a href="#demo" className="hover:text-sky-400 transition-colors">Démonstration</a>
            <a href="#faq" className="hover:text-sky-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard"
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700"
            >
              Accéder au Dashboard
            </Link>
            <Link 
              href="/onboarding"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-1.5"
            >
              <span>Créer mon école</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>Spécialement conçu pour le Sénégal et l'Afrique Francophone</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Une plateforme tout-en-un pour <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              gérer simplement votre établissement scolaire.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Remplacez définitivement les cahiers papier, registres manuels et fichiers Excel dispersés. 
            Centralisez vos <strong>Élèves, Inscriptions, Paiements, Notes, Bulletins PDF, Absences et Cartes QR</strong> dans un espace multi-tenant ultra-sécurisé.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-2xl shadow-xl shadow-sky-500/30 transition-all flex items-center justify-center space-x-2"
            >
              <Building2 className="w-5 h-5" />
              <span>Créer mon école (Essai Gratuit)</span>
            </Link>
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Explorer la démo en direct</span>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-black text-sky-400">100%</p>
              <p className="text-xs text-slate-400">Isolation Multi-Tenant</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-black text-emerald-400">Automatisé</p>
              <p className="text-xs text-slate-400">Calcul des Moyennes & Rangs</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-black text-amber-400">QR Code</p>
              <p className="text-xs text-slate-400">Cartes & Inscriptions</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <p className="text-2xl font-black text-purple-400">Wave & OM</p>
              <p className="text-xs text-slate-400">Prêt pour paiements locaux</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">
              Toutes les opérations scolaires centralisées
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Chaque établissement dispose de son espace propre et étanche pour gérer quotidiennement ses processus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Gestion des Élèves & Matricules</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Génération automatique de matricules uniques (<code className="text-sky-300">ELV-2026-XXXXX</code>), fiches élèves complètes, import/export Excel en masse et suivi de l'historique scolaire d'année en année.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Notes, Moyennes & Bulletins PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Saisie intuitive des devoirs et compositions, calcul automatique des moyennes pondérées (40/60) et rangs, puis génération en masse de bulletins PDF personnalisés.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Paiements & Module Impayés</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Suivi de scolarité mensuelle, reçus de paiement imprimables, identification instantanée des mensualités impayées et traçabilité comptable totale.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Cartes Scolaires QR Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Génération en masse de cartes scolaires avec photos et QR Code dynamique permettant de vérifier instantanément l'identité et le statut d'inscription.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Appel & Suivi d'Assiduité</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Appel numérique en 1 clic pour enregistrer présences, absences et retards. Notification et récapitulatif synthétique pour la direction et les parents.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Portails Parents & Élèves</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accès personnel sécurisé pour les parents (vision multi-enfants, notes, calendrier, suivi des versements) et pour les élèves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Tarifs transparents sans frais cachés</h2>
            <p className="text-slate-400 text-sm">Choisissez la formule adaptée à la taille de votre établissement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-slate-900 p-8 rounded-3xl border relative flex flex-col justify-between ${
                  plan.id === 'plan-standard' 
                    ? 'border-sky-500 shadow-2xl shadow-sky-500/10 ring-2 ring-sky-500/30' 
                    : 'border-slate-800'
                }`}
              >
                {plan.id === 'plan-standard' && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Recommandé pour 80% des Écoles
                  </span>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-white">{plan.priceFcfa.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs font-semibold">FCFA / mois</span>
                  </div>

                  <ul className="space-y-2.5 pt-4 text-xs text-slate-300">
                    <li className="flex items-center space-x-2 text-sky-400 font-semibold">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Jusqu'à {plan.maxStudents} élèves</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sky-400 font-semibold">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{plan.maxUsers} utilisateurs & {plan.maxClasses} classes</span>
                    </li>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link 
                    href="/onboarding"
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      plan.id === 'plan-standard'
                        ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <span>Démarrer avec le plan {plan.name}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 px-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EduSaaS Afrique — Tous droits réservés. Conçu pour le Sénégal & l'Afrique Francophone.</p>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-slate-300">Démo Établissement</Link>
            <Link href="/super-admin" className="hover:text-slate-300">Super Admin Console</Link>
            <Link href="/onboarding" className="hover:text-slate-300">Assistant Onboarding</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
