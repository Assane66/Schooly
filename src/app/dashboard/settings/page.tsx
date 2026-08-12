'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { Settings, ShieldCheck, History, Save, CheckCircle2, Lock, UserCheck } from 'lucide-react';

export default function SettingsPage() {
  const { currentSchool, logs, users } = useAppStore();

  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'PERMISSIONS' | 'AUDIT'>('SETTINGS');
  const [saved, setSaved] = useState(false);

  const schoolLogs = logs.filter(l => l.schoolId === currentSchool.id);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Paramètres & Journal d'Audit</span>
            <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full">
              {currentSchool.code}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configuration des droits d'accès par rôle, informations de l'école et traçabilité des opérations.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`pb-3 px-4 transition-all border-b-2 ${
            activeTab === 'SETTINGS' ? 'border-sky-600 text-sky-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Coordonnées de l'École
        </button>
        <button
          onClick={() => setActiveTab('PERMISSIONS')}
          className={`pb-3 px-4 transition-all border-b-2 ${
            activeTab === 'PERMISSIONS' ? 'border-sky-600 text-sky-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Permissions & Rôles
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`pb-3 px-4 transition-all border-b-2 ${
            activeTab === 'AUDIT' ? 'border-sky-600 text-sky-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Journal d'Audit ({schoolLogs.length} événements)
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Paramètres de l'établissement sauvegardés avec succès !</span>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-3xl space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom Officiel de l'École</label>
                <input type="text" defaultValue={currentSchool.name} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Code / Abréviation</label>
                <input type="text" defaultValue={currentSchool.code} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Téléphone / WhatsApp</label>
                <input type="text" defaultValue={currentSchool.phone} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Officiel</label>
                <input type="email" defaultValue={currentSchool.email} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ville & Pays</label>
                <input type="text" defaultValue={`${currentSchool.city}, ${currentSchool.country}`} className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Devise Principale</label>
                <input type="text" defaultValue="FCFA (XOF)" readOnly className="w-full bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl font-bold" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md">
                <Save className="w-4 h-4" />
                <span>Sauvegarder les modifications</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Permissions Tab (Section 41 of CAHIER DES CHARGES) */}
      {activeTab === 'PERMISSIONS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800">Matrice Granulaire des Habilitations par Rôle</h3>
          <p className="text-xs text-slate-500">Les permissions backend sont indépendantes du rôle et appliquées au niveau de la base de données.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Permission Système</th>
                  <th className="p-3 text-center">Directeur</th>
                  <th className="p-3 text-center">Secrétaire</th>
                  <th className="p-3 text-center">Comptable</th>
                  <th className="p-3 text-center">Enseignant</th>
                  <th className="p-3 text-center">Surveillant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                <tr>
                  <td className="p-3 font-mono text-[11px] text-sky-700 font-bold">students.create / edit / delete</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[11px] text-sky-700 font-bold">payments.create / edit</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[11px] text-sky-700 font-bold">grades.create / edit</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[11px] text-sky-700 font-bold">attendance.create</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center text-slate-300">-</td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="p-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab (Section 43 of CAHIER DES CHARGES) */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800 flex items-center justify-between">
            <span>Journal d'Audit des Actions Utilisateurs</span>
            <span className="text-xs text-slate-400 font-mono">Horodaté & Inaltérable</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Utilisateur & Rôle</th>
                  <th className="p-4">Événement Action</th>
                  <th className="p-4">Détails de l'Opération</th>
                  <th className="p-4">Horodatage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block text-xs">{log.userName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700">{log.details}</td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
