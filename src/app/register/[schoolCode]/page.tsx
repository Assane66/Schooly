'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store/use-app-store';
import { Building2, CheckCircle2, GraduationCap, Send, Sparkles } from 'lucide-react';

export default function PublicRegisterPage() {
  const params = useParams();
  const schoolCode = params.schoolCode as string;
  const { schools, classes } = useAppStore();

  const school = schools.find(s => s.code.toLowerCase() === schoolCode?.toLowerCase()) || schools[0];
  const schoolClasses = classes.filter(c => c.schoolId === school.id);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    candidateFirstName: '',
    candidateLastName: '',
    dateOfBirth: '2014-06-10',
    placeOfBirth: 'Dakar',
    gender: 'M' as 'M' | 'F',
    parentName: '',
    parentPhone: '+221 ',
    requestedClassId: schoolClasses[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* School Header Banner */}
        <div className="flex items-center space-x-4 border-b border-slate-700 pb-6">
          <img src={school.logo} alt={school.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
          <div>
            <h1 className="text-lg font-bold text-white leading-snug">{school.name}</h1>
            <p className="text-xs text-sky-400 font-medium">Formulaire Officiel d'Inscription En Ligne</p>
            <p className="text-[11px] text-slate-400">{school.city}, {school.country} • {school.phone}</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">Demande Transmise avec Succès !</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              La demande d'inscription pour <strong>{form.candidateFirstName} {form.candidateLastName}</strong> a bien été enregistrée par l'administration de l'établissement {school.name}. Vous recevrez une confirmation par téléphone / SMS.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Identité du Candidat Élève</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Prénom de l'élève *</label>
                <input 
                  type="text" 
                  required
                  value={form.candidateFirstName}
                  onChange={(e) => setForm({...form, candidateFirstName: e.target.value})}
                  placeholder="ex: Alpha"
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nom de famille *</label>
                <input 
                  type="text" 
                  required
                  value={form.candidateLastName}
                  onChange={(e) => setForm({...form, candidateLastName: e.target.value})}
                  placeholder="ex: Ba"
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Date de Naissance *</label>
                <input 
                  type="date" 
                  required
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({...form, dateOfBirth: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Lieu de Naissance *</label>
                <input 
                  type="text" 
                  required
                  value={form.placeOfBirth}
                  onChange={(e) => setForm({...form, placeOfBirth: e.target.value})}
                  placeholder="ex: Dakar"
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Genre *</label>
                <select 
                  value={form.gender}
                  onChange={(e) => setForm({...form, gender: e.target.value as 'M' | 'F'})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="M">Masculin (Garçon)</option>
                  <option value="F">Féminin (Fille)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Classe demandée *</label>
                <select 
                  value={form.requestedClassId}
                  onChange={(e) => setForm({...form, requestedClassId: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                >
                  {schoolClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-slate-700 my-4" />

            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Coordonnées du Tuteur / Parent</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nom complet du Parent *</label>
                <input 
                  type="text" 
                  required
                  value={form.parentName}
                  onChange={(e) => setForm({...form, parentName: e.target.value})}
                  placeholder="ex: Abdoulaye Ba"
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Téléphone / WhatsApp *</label>
                <input 
                  type="text" 
                  required
                  value={form.parentPhone}
                  onChange={(e) => setForm({...form, parentPhone: e.target.value})}
                  placeholder="+221 77..."
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-xl shadow-sky-500/20 text-xs flex items-center justify-center space-x-2 transition-all mt-4"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer la demande de préinscription</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
