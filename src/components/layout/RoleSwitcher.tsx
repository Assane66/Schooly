'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { UserRole } from '@/types';
import { ShieldAlert, School as SchoolIcon, Users, UserCheck } from 'lucide-react';

const ROLES_LIST: { role: UserRole; label: string; bg: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin SaaS', bg: 'bg-purple-600' },
  { role: 'DIRECTEUR', label: 'Directeur', bg: 'bg-blue-600' },
  { role: 'SECRETAIRE', label: 'Secrétaire', bg: 'bg-indigo-600' },
  { role: 'COMPTABLE', label: 'Comptable', bg: 'bg-emerald-600' },
  { role: 'ENSEIGNANT', label: 'Enseignant', bg: 'bg-amber-600' },
  { role: 'SURVEILLANT', label: 'Surveillant', bg: 'bg-rose-600' },
  { role: 'PARENT', label: 'Parent d\'élève', bg: 'bg-teal-600' },
  { role: 'ELEVE', label: 'Élève', bg: 'bg-cyan-600' },
];

export function RoleSwitcher() {
  const { currentRole, setCurrentRole, schools, currentSchool, setCurrentSchool } = useAppStore();

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-sm no-print">
      <div className="flex items-center space-x-2">
        <span className="flex items-center font-bold text-amber-400 gap-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          MODE DÉMONSTRATION MULTI-RÔLE
        </span>
        <span className="hidden sm:inline text-slate-400">
          Testez l'interface sous chaque profil :
        </span>
      </div>

      <div className="flex items-center space-x-3 flex-wrap gap-y-1">
        {/* School Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
          <SchoolIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400 text-[11px]">École :</span>
          <select 
            value={currentSchool.id}
            onChange={(e) => {
              const sch = schools.find(s => s.id === e.target.value);
              if (sch) setCurrentSchool(sch);
            }}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-[11px]"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Role Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          {ROLES_LIST.map(({ role, label, bg }) => {
            const isActive = currentRole === role;
            return (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                  isActive 
                    ? `${bg} text-white shadow-md ring-2 ring-white/30 font-semibold scale-105` 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isActive && <UserCheck className="w-3 h-3" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
