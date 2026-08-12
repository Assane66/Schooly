'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { AttendanceStatus } from '@/types';
import { Clock, CheckCircle2, XCircle, AlertCircle, Plus, Calendar } from 'lucide-react';

export default function AttendancePage() {
  const { currentSchool, classes, students, attendance, addAttendance } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const classStudents = students.filter(s => s.currentClassId === selectedClassId);

  const [attendanceStates, setAttendanceStates] = useState<{ [studentId: string]: AttendanceStatus }>({});

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceStates(prev => ({ ...prev, [studentId]: status }));
    addAttendance({
      studentId,
      classId: selectedClassId,
      date: selectedDate,
      status
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Appel & Suivi des Absences / Retards</span>
            <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2.5 py-0.5 rounded-full">
              Feuille d'Appel Numérique
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enregistrement en 1 clic de la présence, justification des absences et calcul automatique de la ponctualité.
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700">Classe :</span>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700">Date d'appel :</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
          />
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
          Liste d'Appel de la Classe
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Matricule</th>
                <th className="p-4">Statut d'Assiduité</th>
                <th className="p-4">Historique Synthétique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((std) => {
                const currentSt = attendanceStates[std.id] || 'PRESENT';

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={std.photo} className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">
                            {std.firstName} {std.lastName}
                          </span>
                          <span className="font-mono text-[10px] text-sky-600 font-semibold">
                            {std.matricule}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5">
                        <button 
                          onClick={() => handleSetStatus(std.id, 'PRESENT')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            currentSt === 'PRESENT' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Présent
                        </button>
                        <button 
                          onClick={() => handleSetStatus(std.id, 'ABSENT')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            currentSt === 'ABSENT' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>
                        <button 
                          onClick={() => handleSetStatus(std.id, 'RETARD')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            currentSt === 'RETARD' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Retard
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium text-[11px]">
                      0 absence non justifiée • 1 retard enregistré
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
