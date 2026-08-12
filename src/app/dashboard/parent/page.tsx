'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { HeartHandshake, FileText, CreditCard, Clock, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function ParentPortalPage() {
  const { students, classes, payments } = useAppStore();

  // Children associated with Parent
  const myChildren = [students[0], students[2]]; // Alpha Ba (CM2 A) and Moussa Diop (6ème B)
  const [activeChildId, setActiveChildId] = useState(myChildren[0].id);

  const activeChild = students.find(s => s.id === activeChildId) || myChildren[0];
  const activeClass = classes.find(c => c.id === activeChild.currentClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white p-6 rounded-3xl shadow-lg space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold bg-white/20 w-max px-3 py-1 rounded-full">
          <HeartHandshake className="w-4 h-4" />
          <span>Espace Personnel Parent d'Élève</span>
        </div>
        <h1 className="text-2xl font-black">Bienvenue sur votre Espace Tuteur</h1>
        <p className="text-xs text-teal-100 max-w-xl">
          Suivez la scolarité de vos enfants, leurs résultats scolaires, leur assiduité et vos réglements de scolarité en temps réel.
        </p>
      </div>

      {/* Children Selection Tabs (Section 36 of CAHIER DES CHARGES) */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {myChildren.map((child) => {
          const cls = classes.find(c => c.id === child.currentClassId);
          const isActive = child.id === activeChildId;
          return (
            <button
              key={child.id}
              onClick={() => setActiveChildId(child.id)}
              className={`p-4 rounded-2xl border text-left transition-all min-w-[220px] flex items-center space-x-3 ${
                isActive 
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <img src={child.photo} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-slate-800">{child.firstName} {child.lastName}</h4>
                <p className="text-[11px] font-semibold text-teal-600">{cls?.name}</p>
                <span className="text-[10px] text-slate-400 font-mono">{child.matricule}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Child Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>Résultats Scolaires</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Trimestre 1
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold block">MOYENNE GÉNÉRALE</span>
            <span className="text-3xl font-black text-slate-900">16.17 / 20</span>
            <span className="text-xs text-emerald-600 font-bold block">Rang : 1er de la classe</span>
          </div>

          <Link href="/dashboard/bulletins" className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold block text-center transition-all">
            Télécharger le Bulletin Officiel PDF
          </Link>
        </div>

        {/* Financial Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Situation Financière</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              À jour
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Octobre 2025 :</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Réglé (35 000 FCFA)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Novembre 2025 :</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Réglé (35 000 FCFA)</span>
            </div>
          </div>

          <Link href="/dashboard/finance" className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold block text-center transition-all">
            Consulter l'échéancier & Reçus
          </Link>
        </div>

        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Assiduité & Absences</span>
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Total Absences :</span>
              <span className="font-bold text-slate-900">0 heure</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Total Retards :</span>
              <span className="font-bold text-amber-600">1 enregistrement (15 min)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
