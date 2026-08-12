'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  Users, GraduationCap, DollarSign, AlertCircle, Clock, 
  UserPlus, BookOpen, FileCheck, QrCode, ArrowUpRight, 
  CheckCircle2, Plus, Sparkles, TrendingUp, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

export default function SchoolDashboardPage() {
  const { 
    currentSchool, students, classes, payments, 
    registrations, attendance, currentRole 
  } = useAppStore();

  // Filter items for active school tenant
  const schoolStudents = students.filter(s => s.schoolId === currentSchool.id);
  const schoolClasses = classes.filter(c => c.schoolId === currentSchool.id);
  const schoolPayments = payments.filter(p => p.schoolId === currentSchool.id);
  const schoolRegistrations = registrations.filter(r => r.schoolId === currentSchool.id && r.status === 'PENDING');
  const schoolAttendance = attendance.filter(a => a.schoolId === currentSchool.id);

  // Financial statistics calculation
  const totalEncaisse = schoolPayments
    .filter(p => p.status === 'REGLE' || p.status === 'PARTIEL')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalImpayes = schoolPayments
    .filter(p => p.status === 'EN_RETARD' || p.status === 'EN_ATTENTE')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayAbsences = schoolAttendance.filter(a => a.status === 'ABSENT').length;
  const todayRetards = schoolAttendance.filter(a => a.status === 'RETARD').length;

  // Chart data
  const paymentChartData = [
    { month: 'Septembre', encaissé: 450000, attendu: 500000 },
    { month: 'Octobre', encaissé: 620000, attendu: 650000 },
    { month: 'Novembre', encaissé: totalEncaisse, attendu: totalEncaisse + totalImpayes },
  ];

  const classEffectifsData = schoolClasses.map(c => ({
    name: c.name,
    effectif: c.studentCount,
    capacite: c.maxCapacity
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Tableau de Bord Établissement</span>
            <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
              {currentSchool.code}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aperçu en temps réel des opérations scolaires et financières de {currentSchool.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link 
            href="/dashboard/students?action=new"
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un élève</span>
          </Link>
          <Link 
            href="/dashboard/finance"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>Encasser Scolarité</span>
          </Link>
        </div>
      </div>

      {/* Action Rapides Bar (Section 39 of CAHIER DES CHARGES) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Actions Rapides d'Administration</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          <Link href="/dashboard/students" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <UserPlus className="w-5 h-5 text-sky-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Nouveau Élève</span>
          </Link>
          <Link href="/dashboard/students?import=true" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <Users className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Import Excel</span>
          </Link>
          <Link href="/dashboard/finance" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <DollarSign className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Paiement</span>
          </Link>
          <Link href="/dashboard/grades" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <BookOpen className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Saisie Notes</span>
          </Link>
          <Link href="/dashboard/attendance" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <Clock className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Faire l'Appel</span>
          </Link>
          <Link href="/dashboard/bulletins" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <FileCheck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Bulletins PDF</span>
          </Link>
          <Link href="/dashboard/cards" className="p-2.5 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 rounded-xl border border-slate-100 text-center transition-all">
            <QrCode className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
            <span className="text-[11px] font-semibold text-slate-700 block">Cartes QR</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Section 38 of CAHIER DES CHARGES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Effectif Total Élèves</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-800">{schoolStudents.length}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              +12% <TrendingUp className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Répartis sur {schoolClasses.length} classes actives.</p>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Recouvrement Mois</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-800">{totalEncaisse.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500">FCFA</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">Taux de paiement : 91%</p>
        </div>

        {/* Total Unpaid / Late */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Montant Restant Impayé</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-800">{totalImpayes.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500">FCFA</span>
          </div>
          <Link href="/dashboard/finance/unpaid" className="text-[11px] text-amber-600 hover:underline font-semibold flex items-center">
            Voir relances impayés <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Absences & Attendance today */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Absences / Retards Aujourd'hui</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-extrabold text-rose-600">{todayAbsences} abs</span>
            <span className="text-sm font-bold text-amber-600">{todayRetards} retards</span>
          </div>
          <p className="text-[11px] text-slate-400">Suivi d'assiduité du jour.</p>
        </div>
      </div>

      {/* Analytics Charts & Pending Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Évolution des Recouvrements (FCFA)</h3>
              <p className="text-xs text-slate-400">Comparatif montants encaissés vs objectifs mensuels.</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              FCFA (XOF)
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paymentChartData}>
                <defs>
                  <linearGradient id="encaisseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString()} FCFA`, 'Montant']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="encaissé" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#encaisseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Registration demandes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-sky-600" />
                <span>Demandes d'Inscription</span>
              </h3>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {schoolRegistrations.length} en attente
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {schoolRegistrations.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Aucune inscription en attente.</p>
              ) : (
                schoolRegistrations.map((reg) => (
                  <div key={reg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{reg.candidateFirstName} {reg.candidateLastName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(reg.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Tuteur : {reg.parentName} ({reg.parentPhone})</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link 
            href="/dashboard/registrations"
            className="w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all mt-4"
          >
            Traiter les demandes & Générer QR Code
          </Link>
        </div>
      </div>
    </div>
  );
}
