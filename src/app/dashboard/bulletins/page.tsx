'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { FileCheck, Printer, Download, Sparkles, Award } from 'lucide-react';

export default function BulletinsPage() {
  const { currentSchool, classes, students, subjects, grades } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const classStudents = students.filter(s => s.currentClassId === selectedClassId);
  const activeStudent = students.find(s => s.id === selectedStudentId) || classStudents[0] || students[0];
  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Subject marks breakdown simulation
  const subjectSummaries = subjects.map((sbj, idx) => {
    const devMark = 14 + (idx % 4);
    const compMark = 15 + (idx % 3);
    const subjectAvg = Number(((devMark * 0.4) + (compMark * 0.6)).toFixed(2));
    return {
      subject: sbj,
      devoir: devMark,
      composition: compMark,
      average: subjectAvg,
      coef: sbj.defaultCoefficient,
      totalPoints: Number((subjectAvg * sbj.defaultCoefficient).toFixed(2)),
      appreciation: subjectAvg >= 16 ? 'Très Bon travail' : subjectAvg >= 14 ? 'Bon travail' : 'Travail régulier'
    };
  });

  const totalCoef = subjectSummaries.reduce((sum, s) => sum + s.coef, 0);
  const totalPoints = subjectSummaries.reduce((sum, s) => sum + s.totalPoints, 0);
  const gpa = Number((totalPoints / totalCoef).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Header & Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Bulletins de Notes Trimestriels</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Génération Masse PDF
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Impression des bulletins officiels avec entête personnalisée de l'établissement.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / Exporter le Bulletin PDF</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs no-print">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-700">Classe :</span>
          <select 
            value={selectedClassId} 
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedStudentId(null);
            }}
            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <span className="font-semibold text-slate-700 whitespace-nowrap">Choisir l'élève :</span>
          {classStudents.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all ${
                activeStudent?.id === s.id ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.firstName} {s.lastName}
            </button>
          ))}
        </div>
      </div>

      {/* Official Report Card Printable Document (Sections 22, 23 of CAHIER DES CHARGES) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-6 print:shadow-none print:border-none print:p-0">
        
        {/* School Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
          <div className="flex items-center space-x-4">
            <img src={currentSchool.logo} alt={currentSchool.name} className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{currentSchool.name}</h2>
              <p className="text-xs text-slate-600">{currentSchool.address} • {currentSchool.city}, {currentSchool.country}</p>
              <p className="text-xs text-slate-600">Tél : {currentSchool.phone} • Email : {currentSchool.email}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg uppercase">
              BULLETIN TRIMESTRIEL
            </span>
            <p className="text-xs font-bold text-slate-800 mt-2">Trimestre 1 — 2025/2026</p>
          </div>
        </div>

        {/* Student Profile Info Grid */}
        <div className="grid grid-cols-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs gap-3">
          <div>
            <span className="text-slate-500 font-medium">Nom & Prénom de l'Élève :</span>
            <p className="font-extrabold text-slate-900 text-sm">{activeStudent?.firstName} {activeStudent?.lastName}</p>
            <span className="text-slate-500 font-medium mt-1 block">Matricule Unique :</span>
            <p className="font-mono font-bold text-sky-700">{activeStudent?.matricule}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-500 font-medium">Classe :</span>
            <p className="font-extrabold text-slate-900 text-sm">{activeClass?.name}</p>
            <span className="text-slate-500 font-medium mt-1 block">Effectif de la classe :</span>
            <p className="font-bold text-slate-800">{classStudents.length || 32} élèves</p>
          </div>
        </div>

        {/* Subject & Marks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300">Matières Enseignées</th>
                <th className="p-2.5 text-center border-r border-slate-300">Devoir (40%)</th>
                <th className="p-2.5 text-center border-r border-slate-300">Composition (60%)</th>
                <th className="p-2.5 text-center border-r border-slate-300">Moyenne / 20</th>
                <th className="p-2.5 text-center border-r border-slate-300">Coef</th>
                <th className="p-2.5 text-center border-r border-slate-300">Total Points</th>
                <th className="p-2.5">Appréciation Pédagogique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjectSummaries.map((s) => (
                <tr key={s.subject.id} className="hover:bg-slate-50/50">
                  <td className="p-2.5 font-bold text-slate-800 border-r border-slate-300">{s.subject.name}</td>
                  <td className="p-2.5 text-center border-r border-slate-300">{s.devoir}</td>
                  <td className="p-2.5 text-center border-r border-slate-300">{s.composition}</td>
                  <td className="p-2.5 text-center font-extrabold text-slate-900 border-r border-slate-300 bg-slate-50">{s.average}</td>
                  <td className="p-2.5 text-center font-bold border-r border-slate-300">{s.coef}</td>
                  <td className="p-2.5 text-center font-bold text-slate-900 border-r border-slate-300">{s.totalPoints}</td>
                  <td className="p-2.5 text-slate-700 italic">{s.appreciation}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-400">
              <tr>
                <td colSpan={4} className="p-3 text-right border-r border-slate-300">TOTAL DES COEFFICIENTS ET POINTS :</td>
                <td className="p-3 text-center border-r border-slate-300">{totalCoef}</td>
                <td className="p-3 text-center border-r border-slate-300">{totalPoints}</td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Synthesis & GPA Block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 text-white p-5 rounded-2xl">
          <div className="text-center space-y-1 border-r border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block">MOYENNE GÉNÉRALE</span>
            <span className="text-3xl font-black text-sky-400">{gpa} / 20</span>
          </div>
          <div className="text-center space-y-1 border-r border-slate-700">
            <span className="text-[11px] text-slate-400 font-semibold block">RANG DANS LA CLASSE</span>
            <span className="text-3xl font-black text-amber-400">1er / {classStudents.length || 32}</span>
          </div>
          <div className="text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">MOYENNE DE LA CLASSE</span>
            <span className="text-3xl font-black text-emerald-400">14.15 / 20</span>
          </div>
        </div>

        {/* Absences & Signatures */}
        <div className="grid grid-cols-2 gap-6 pt-4 text-xs">
          <div className="border border-slate-200 p-4 rounded-xl space-y-2">
            <span className="font-bold text-slate-800 block">Assiduité & Discipline :</span>
            <p className="text-slate-600">Absences : <strong>0 heure</strong> • Retards : <strong>1 enregistrement</strong></p>
            <p className="text-slate-600 italic">Mention du Conseil de Classe : <strong>Tableau d'Honneur avec Félicitations</strong></p>
          </div>

          <div className="border border-slate-200 p-4 rounded-xl text-center space-y-8">
            <span className="font-bold text-slate-800 block">Signature du Directeur & Cachet Officiel</span>
            <div className="pt-6 font-mono text-[10px] text-slate-400 italic">
              [Cachet électronique validé par EduSaaS]
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
