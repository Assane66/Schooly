'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { AlertCircle, PhoneCall, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function UnpaidModulePage() {
  const { currentSchool, students, classes } = useAppStore();

  const [selectedMonth, setSelectedMonth] = useState('Novembre 2025');

  // Filter students who haven't paid or are late (e.g. std-003, std-005)
  const unpaidStudents = students.filter((_, idx) => idx % 2 === 1 || idx === 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Module des Impayés & Relances</span>
            <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2.5 py-0.5 rounded-full">
              {unpaidStudents.length} élèves retardataires
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identification automatique des échéances non réglées et relances téléphoniques / WhatsApp.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5">
            <Send className="w-4 h-4" />
            <span>Envoyer rappel WhatsApp massif</span>
          </button>
        </div>
      </div>

      {/* Month Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700">Sélectionner le Mois :</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
          >
            <option value="Octobre 2025">Octobre 2025</option>
            <option value="Novembre 2025">Novembre 2025 (Mois en cours)</option>
            <option value="Décembre 2025">Décembre 2025</option>
          </select>
        </div>

        <div className="text-right font-bold text-rose-600">
          Total dû non perçu : {(unpaidStudents.length * 35000).toLocaleString()} FCFA
        </div>
      </div>

      {/* Unpaid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Matricule</th>
                <th className="p-4">Classe</th>
                <th className="p-4">Téléphone Tuteur / Parent</th>
                <th className="p-4">Montant Dû</th>
                <th className="p-4">Statut Relance</th>
                <th className="p-4 text-right">Actions Directes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unpaidStudents.map((std) => {
                const cls = classes.find(c => c.id === std.currentClassId);
                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block text-xs">
                        {std.firstName} {std.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-sky-600 font-semibold">
                        {std.matricule}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                        {cls ? cls.name : 'Non affecté'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {std.phone || '+221 77 654 99 88'}
                    </td>
                    <td className="p-4 font-black text-rose-600 text-sm">
                      35 000 FCFA
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Rappel envoyé (12 nov.)
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <a 
                        href={`https://wa.me/221776549988?text=Bonjour,%20relance%20pour%20la%20scolarité%20de%20${std.firstName}%20${std.lastName}`}
                        target="_blank"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 transition-all inline-flex items-center space-x-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Relancer WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
