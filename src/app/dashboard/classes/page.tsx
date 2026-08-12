'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { GraduationCap, Users, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export default function ClassesPage() {
  const { currentSchool, classes, students, levels, users } = useAppStore();

  const schoolClasses = classes.filter(c => c.schoolId === currentSchool.id);
  const teachers = users.filter(u => u.schoolId === currentSchool.id && u.role === 'ENSEIGNANT');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Gestion des Classes & Effectifs</span>
            <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full">
              {schoolClasses.length} classes
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi de la capacité maximale, des professeurs principaux et des taux de remplissage.
          </p>
        </div>

        <button className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5">
          <Plus className="w-4 h-4" />
          <span>Créer une nouvelle classe</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schoolClasses.map((c) => {
          const classStudents = students.filter(s => s.currentClassId === c.id);
          const currentCount = classStudents.length || c.studentCount;
          const fillPercentage = Math.round((currentCount / c.maxCapacity) * 100);
          const mainTeacher = teachers.find(t => t.id === c.mainTeacherId);

          return (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-slate-800">{c.name}</span>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                    Taux : {fillPercentage}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Effectif actuel : {currentCount} élèves</span>
                    <span>Capacité : {c.maxCapacity}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all rounded-full ${
                        fillPercentage > 90 ? 'bg-rose-500' :
                        fillPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 text-xs space-y-1">
                  <span className="text-slate-400 block font-medium">Professeur Principal :</span>
                  <span className="font-bold text-slate-700 block">
                    {mainTeacher ? mainTeacher.name : 'Mamadou Diop (Référent)'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Année : 2025-2026</span>
                <button className="text-sky-600 font-semibold hover:underline">
                  Voir la liste des élèves →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
