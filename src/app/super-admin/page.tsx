'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  Building2, Users, DollarSign, Sparkles, ShieldAlert, 
  Search, CheckCircle2, XCircle, Settings, Layers 
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { schools, students, plans, logs } = useAppStore();

  const [search, setSearch] = useState('');

  const activeSchoolsCount = schools.filter(s => s.status === 'ACTIVE').length;
  const totalMrr = plans[1].priceFcfa * activeSchoolsCount + plans[2].priceFcfa * 1; // Revenue calculation in FCFA

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8 font-sans">
      {/* Super Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-xl shadow-purple-500/20">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>Console Super Admin SaaS</span>
              <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full font-mono">
                PROPRIÉTAIRE PLATEFORME
              </span>
            </h1>
            <p className="text-xs text-slate-400">Supervision globale des établissements scolaires, abonnements et revenus MRR.</p>
          </div>
        </div>

        <Link 
          href="/dashboard"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
        >
          <Building2 className="w-4 h-4 text-sky-400" />
          <span>Accéder à l'espace école démo</span>
        </Link>
      </div>

      {/* SaaS Platform Platform Level KPIs (Section 47 & 64 of CAHIER DES CHARGES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Établissements Raccordés</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{schools.length}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {activeSchoolsCount} actives
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Sénégal & Afrique Francophone</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Total Élèves Gérés</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-sky-400">{students.length + 150}</span>
            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
              Base Centralisée
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Matricules uniques isolés par schoolId</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">MRR (Revenu Mensuel Récurrent)</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-emerald-400">{totalMrr.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400">FCFA / mois</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold">+18% ce mois-ci</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Abonnements SaaS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-purple-400">{activeSchoolsCount}</span>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              Standard / Premium
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Taux de renouvellement : 98%</p>
        </div>
      </div>

      {/* School Management Table (Section 48 of CAHIER DES CHARGES) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <span>Gestion des Établissements Scolaires Client SaaS</span>
          </h2>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une école, un code, une ville..."
              className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Établissement</th>
                <th className="p-4">Ville & Responsable</th>
                <th className="p-4">Abonnement Active</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSchools.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-850 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={sch.logo} className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-white" />
                      <div>
                        <span className="font-bold text-white block text-xs">{sch.name}</span>
                        <span className="font-mono text-[10px] text-sky-400 font-semibold">{sch.code}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-200 block">{sch.city}, {sch.country}</span>
                    <span className="text-[11px] text-slate-400">{sch.headmaster}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Standard (55 000 FCFA/m)
                    </span>
                  </td>
                  <td className="p-4">
                    {sch.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3 mr-1" /> Suspendu
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-all">
                      Gérer le Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
