'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { GraduationCap, Award, BookOpen, Clock, FileCheck, Sparkles } from 'lucide-react';

export default function StudentPortalPage() {
  const { students, classes, subjects } = useAppStore();

  const student = students[0]; // Alpha Ba
  const studentClass = classes.find(c => c.id === student.currentClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg space-y-3">
        <div className="flex items-center space-x-3">
          <img src={student.photo} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">{student.firstName} {student.lastName}</h1>
              <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold">{studentClass?.name}</span>
            </div>
            <p className="font-mono text-xs text-cyan-200 mt-0.5">Matricule Élève : {student.matricule}</p>
          </div>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Ma Moyenne Générale</h3>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">16.17 / 20</p>
          <span className="text-xs font-bold text-emerald-600">Félicitations du conseil</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Mon Rang en Classe</h3>
            <GraduationCap className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-sky-600">1er / 32</p>
          <span className="text-xs text-slate-500">CM2 A</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Mon Assiduité</h3>
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-emerald-600">100%</p>
          <span className="text-xs text-slate-500">0 absence ce trimestre</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800">Mes Matières & Coefficients</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {subjects.map(s => (
            <div key={s.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block">{s.name}</span>
              <span className="text-[11px] text-slate-500">Coefficient : {s.defaultCoefficient}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
