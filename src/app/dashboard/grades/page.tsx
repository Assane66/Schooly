'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  BookOpen, Plus, Upload, Save, CheckCircle2, 
  FileSpreadsheet, Award, Edit3 
} from 'lucide-react';

export default function GradeEntryPage() {
  const { currentSchool, classes, subjects, students, evaluations, grades, addGrade, addEvaluation } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedEvalId, setSelectedEvalId] = useState(evaluations[0]?.id || '');

  const [gradeInputs, setGradeInputs] = useState<{ [studentId: string]: number }>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const classStudents = students.filter(s => s.currentClassId === selectedClassId);

  const handleSaveGrades = () => {
    Object.entries(gradeInputs).forEach(([studentId, mark]) => {
      addGrade({
        evaluationId: selectedEvalId,
        studentId,
        mark,
        comment: mark >= 16 ? 'Excellent' : mark >= 12 ? 'Assez Bien' : 'Doit s\'améliorer'
      });
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Saisie Pédagogique des Notes</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
              Saisie directe & Excel
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisissez ou importez les notes de devoirs et compositions par classe et matière.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-200">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Télécharger modèle Excel</span>
          </button>
          <button 
            onClick={handleSaveGrades}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer toutes les notes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Toutes les notes saisies ont été sauvegardées et les moyennes recalculées en temps réel !</span>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Classe :</label>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 focus:outline-none"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Matière :</label>
          <select 
            value={selectedSubjectId} 
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 focus:outline-none"
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Coef {s.defaultCoefficient})</option>)}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Évaluation :</label>
          <select 
            value={selectedEvalId} 
            onChange={(e) => setSelectedEvalId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 focus:outline-none"
          >
            {evaluations.map(ev => <option key={ev.id} value={ev.id}>{ev.title} ({ev.evaluationType})</option>)}
          </select>
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-800">Feuille de Saisie de Notes</span>
          <span className="text-xs text-slate-500 font-medium">Barème par défaut : / 20</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève</th>
                <th className="p-4">Matricule</th>
                <th className="p-4">Note / 20</th>
                <th className="p-4">Appréciation rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((std) => {
                const existingGrade = grades.find(g => g.evaluationId === selectedEvalId && g.studentId === std.id);
                const currentVal = gradeInputs[std.id] !== undefined ? gradeInputs[std.id] : (existingGrade ? existingGrade.mark : 15);

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={std.photo} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-slate-800">{std.firstName} {std.lastName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-sky-600 font-semibold">{std.matricule}</td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        min="0" 
                        max="20" 
                        step="0.5"
                        value={currentVal}
                        onChange={(e) => setGradeInputs({...gradeInputs, [std.id]: parseFloat(e.target.value) || 0})}
                        className="w-24 bg-slate-50 border border-slate-300 font-bold text-slate-900 px-3 py-1.5 rounded-xl text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-4 text-slate-500 italic text-[11px]">
                      {currentVal >= 16 ? 'Très Bien' : currentVal >= 14 ? 'Bien' : currentVal >= 10 ? 'Passable' : 'Insuffisant'}
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
