'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  Building2, Calendar, Layers, GraduationCap, Users, UserPlus, 
  DollarSign, Mail, FileCheck, CheckCircle2, ArrowRight, ArrowLeft, 
  Sparkles, Upload, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 1, title: 'Créer l\'école', icon: Building2 },
  { id: 2, title: 'Année scolaire', icon: Calendar },
  { id: 3, title: 'Niveaux', icon: Layers },
  { id: 4, title: 'Classes', icon: GraduationCap },
  { id: 5, title: 'Enseignants', icon: Users },
  { id: 6, title: 'Importer élèves', icon: UserPlus },
  { id: 7, title: 'Frais scolaires', icon: DollarSign },
  { id: 8, title: 'Inviter équipe', icon: Mail },
  { id: 9, title: 'Modèle bulletin', icon: FileCheck },
  { id: 10, title: 'Lancement', icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { addSchool, setCurrentSchool } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [schoolData, setSchoolData] = useState({
    name: 'Complexe Scolaire Horizon Nouveauté',
    city: 'Dakar',
    phone: '+221 33 825 00 11',
    email: 'direction@horizon-nouveaute.sn',
    headmaster: 'Mme Marie Ndiaye',
    schoolTypes: ['Primaire', 'Collège']
  });

  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [tuitionFee, setTuitionFee] = useState(30000);

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Step 10 Finish celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback if confetti canvas fails
      }

      // Save new school to app store
      const newSch = addSchool({
        name: schoolData.name,
        city: schoolData.city,
        phone: schoolData.phone,
        email: schoolData.email,
        headmaster: schoolData.headmaster
      });
      setCurrentSchool(newSch);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Assistant de Configuration Onboarding</h1>
            <p className="text-[11px] text-slate-400">Étape {currentStep} sur 10 — Configuration initiale</p>
          </div>
        </div>

        <button 
          onClick={() => router.push('/dashboard')}
          className="text-xs text-slate-400 hover:text-white underline"
        >
          Passer et aller au tableau de bord
        </button>
      </header>

      {/* Steps Indicator Bar */}
      <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center space-x-2 min-w-max">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            return (
              <div 
                key={s.id} 
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent ? 'bg-sky-500 text-white shadow-md font-bold' :
                  isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-slate-900 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span>{s.id}. {s.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Content Area */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-6 flex flex-col justify-center">
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Step 1: Créer l'école */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sky-400">
                <Building2 className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold text-white">1. Informations de votre Établissement</h2>
                  <p className="text-xs text-slate-400">Renseignez le nom officiel et les coordonnées de l'école.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Nom de l'établissement *</label>
                  <input 
                    type="text" 
                    value={schoolData.name}
                    onChange={(e) => setSchoolData({...schoolData, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Ville *</label>
                  <input 
                    type="text" 
                    value={schoolData.city}
                    onChange={(e) => setSchoolData({...schoolData, city: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Téléphone / WhatsApp *</label>
                  <input 
                    type="text" 
                    value={schoolData.phone}
                    onChange={(e) => setSchoolData({...schoolData, phone: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email officiel *</label>
                  <input 
                    type="email" 
                    value={schoolData.email}
                    onChange={(e) => setSchoolData({...schoolData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Année scolaire */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sky-400">
                <Calendar className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold text-white">2. Définir l'Année Scolaire</h2>
                  <p className="text-xs text-slate-400">Sélectionnez la période académique active.</p>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-3">
                <label className="text-xs text-slate-300 font-semibold">Libellé de l'Année Scolaire</label>
                <select 
                  value={academicYear} 
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs"
                >
                  <option value="2025-2026">2025 - 2026 (Année en cours)</option>
                  <option value="2026-2027">2026 - 2027</option>
                </select>
                <p className="text-[11px] text-slate-500">Toutes les inscriptions et données financières de cette session y seront associées.</p>
              </div>
            </div>
          )}

          {/* Step 3: Niveaux */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sky-400">
                <Layers className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold text-white">3. Sélectionner les Niveaux Enseignés</h2>
                  <p className="text-xs text-slate-400">Cochez les cycles présents dans votre école.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {['Préscolaire', 'Primaire', 'Collège', 'Lycée'].map((type) => (
                  <label key={type} className="flex items-center space-x-3 p-3 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer hover:border-sky-500">
                    <input type="checkbox" defaultChecked className="rounded text-sky-500 focus:ring-0" />
                    <span className="font-semibold text-white">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4-9 Summary steps */}
          {currentStep >= 4 && currentStep <= 9 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sky-400">
                <Sparkles className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold text-white">{STEPS[currentStep - 1].id}. {STEPS[currentStep - 1].title}</h2>
                  <p className="text-xs text-slate-400">Configuration rapide pré-remplie par défaut pour votre école.</p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configuration automatique des modèles sénégalais et francophones active.</span>
                </div>
                <p className="text-slate-400">Vous pourrez personnaliser chaque détail directement depuis les sous-menus du tableau de bord à tout moment.</p>
              </div>
            </div>
          )}

          {/* Step 10: Complete */}
          {currentStep === 10 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white">Votre Établissement est Prêt !</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Félicitations, l'espace SaaS de <strong>{schoolData.name}</strong> a été initialisé avec succès.
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>{currentStep === 10 ? 'Accéder au Tableau de Bord' : 'Étape Suivante'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
