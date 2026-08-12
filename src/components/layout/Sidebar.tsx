'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  LayoutDashboard, Users, BookOpen, UserCheck, Calendar, 
  CreditCard, FileText, Settings, ShieldCheck, GraduationCap, 
  FileCheck, AlertCircle, QrCode, Building2, UserPlus, Clock, 
  DollarSign, Sparkles, HeartHandshake, Layers
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, currentSchool } = useAppStore();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  // Super Admin view items
  if (currentRole === 'SUPER_ADMIN') {
    return (
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 no-print">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">SuperAdmin SaaS</h1>
            <p className="text-xs text-purple-400 font-medium">Gestion Multi-Écoles</p>
          </div>
        </div>

        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Console Plateforme
            </div>
            <nav className="space-y-1">
              <Link 
                href="/super-admin"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  pathname === '/super-admin' ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Global</span>
              </Link>
              <Link 
                href="/super-admin/schools"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  pathname.startsWith('/super-admin/schools') ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Gestion des Écoles</span>
              </Link>
              <Link 
                href="/super-admin/plans"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  pathname.startsWith('/super-admin/plans') ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Plans & Abonnements</span>
              </Link>
            </nav>
          </div>

          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Accès Démo Établissement
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-400"
              >
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Voir Espace École ({currentSchool.code})</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          SaaS Écoles Afrique v1.0 MVP
        </div>
      </aside>
    );
  }

  // Parent View
  if (currentRole === 'PARENT') {
    return (
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 no-print">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Portail Parent</h1>
            <p className="text-[11px] text-teal-400">{currentSchool.name}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link href="/dashboard/parent" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/parent' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800'}`}>
            <Users className="w-4 h-4" />
            <span>Mes Enfants</span>
          </Link>
          <Link href="/dashboard/bulletins" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/bulletins' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800'}`}>
            <FileText className="w-4 h-4" />
            <span>Notes & Bulletins</span>
          </Link>
          <Link href="/dashboard/finance" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/finance' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800'}`}>
            <CreditCard className="w-4 h-4" />
            <span>Frais & Paiements</span>
          </Link>
          <Link href="/dashboard/attendance" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/attendance' ? 'bg-teal-600 text-white' : 'hover:bg-slate-800'}`}>
            <Clock className="w-4 h-4" />
            <span>Absences & Retards</span>
          </Link>
        </nav>
      </aside>
    );
  }

  // Student View
  if (currentRole === 'ELEVE') {
    return (
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 no-print">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">Portail Élève</h1>
            <p className="text-[11px] text-cyan-400">{currentSchool.name}</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link href="/dashboard/student" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/student' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Mon Tableau de Bord</span>
          </Link>
          <Link href="/dashboard/bulletins" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/bulletins' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>
            <FileText className="w-4 h-4" />
            <span>Mes Notes & Bulletins</span>
          </Link>
          <Link href="/dashboard/attendance" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium ${pathname === '/dashboard/attendance' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>
            <Clock className="w-4 h-4" />
            <span>Mes Absences</span>
          </Link>
        </nav>
      </aside>
    );
  }

  // Standard School Staff View (Director, Admin, Secretary, Accountant, Teacher, Supervisor)
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 no-print">
      {/* School Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
        <img 
          src={currentSchool.logo} 
          alt={currentSchool.name} 
          className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-white"
        />
        <div className="overflow-hidden">
          <h1 className="font-bold text-white text-xs truncate" title={currentSchool.name}>
            {currentSchool.name}
          </h1>
          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-400 rounded border border-sky-500/30 mt-0.5">
            {currentRole}
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {/* Dashboard */}
        <div>
          <nav className="space-y-1">
            <Link 
              href="/dashboard"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                pathname === '/dashboard' ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Tableau de Bord</span>
            </Link>
          </nav>
        </div>

        {/* Administration Scolaire */}
        {(currentRole === 'DIRECTEUR' || currentRole === 'ADMIN' || currentRole === 'SECRETAIRE') && (
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              École & Gestion
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard/students"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/students') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Gestion Élèves</span>
              </Link>
              <Link 
                href="/dashboard/registrations"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/registrations') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Inscriptions & QR Form</span>
              </Link>
              <Link 
                href="/dashboard/classes"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/classes') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Classes & Effectifs</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Pédagogie */}
        {(currentRole === 'DIRECTEUR' || currentRole === 'ADMIN' || currentRole === 'ENSEIGNANT') && (
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Pédagogie & Évaluations
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard/grades"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/grades') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Saisie des Notes</span>
              </Link>
              <Link 
                href="/dashboard/bulletins"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/bulletins') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Bulletins PDF & Rangs</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Présence & Discipline */}
        {(currentRole === 'DIRECTEUR' || currentRole === 'ADMIN' || currentRole === 'SURVEILLANT' || currentRole === 'ENSEIGNANT') && (
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Assiduité
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard/attendance"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/attendance') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Absences & Retards</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Finance */}
        {(currentRole === 'DIRECTEUR' || currentRole === 'ADMIN' || currentRole === 'COMPTABLE') && (
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Finances & Scolarité
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard/finance"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/finance') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Paiements & Reçus</span>
              </Link>
              <Link 
                href="/dashboard/finance/unpaid"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/finance/unpaid') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Module Impayés</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Documents */}
        {(currentRole === 'DIRECTEUR' || currentRole === 'ADMIN' || currentRole === 'SECRETAIRE') && (
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Studio Documents
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard/cards"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/cards') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Cartes Scolaires QR</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Paramètres & Audit */}
        {(currentRole === 'DIRECTEUR' || currentRole === 'ADMIN') && (
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Administration
            </div>
            <nav className="space-y-1">
              <Link 
                href="/dashboard/settings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive('/dashboard/settings') ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Paramètres & Audit</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">{currentSchool.city}, {currentSchool.country}</span>
        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-sky-400 font-mono">
          2025-2026
        </span>
      </div>
    </aside>
  );
}
