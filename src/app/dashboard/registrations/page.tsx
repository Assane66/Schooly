'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  UserPlus, QrCode, Link2, CheckCircle2, XCircle, Clock, 
  ExternalLink, Copy, Check, Sparkles 
} from 'lucide-react';
import QRCode from 'qrcode';

export default function RegistrationsPage() {
  const { currentSchool, registrations, processRegistration, classes } = useAppStore();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const schoolRegistrations = registrations.filter(r => r.schoolId === currentSchool.id);
  const publicLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/register/${currentSchool.code}` 
    : `https://ecole-saas.sn/register/${currentSchool.code}`;

  useEffect(() => {
    QRCode.toDataURL(publicLink, { width: 200, margin: 2 })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, [publicLink]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Inscriptions & Formulaire Public</span>
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-0.5 rounded-full">
              {schoolRegistrations.filter(r => r.status === 'PENDING').length} demandes en attente
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lien unique et QR Code pour recevoir les candidatures de préinscription en ligne.
          </p>
        </div>
      </div>

      {/* Public Link & QR Code Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl border border-slate-700 shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Lien Public d'Inscription de l'École</span>
          </div>

          <p className="text-xs text-slate-300">
            Partagez ce lien sur WhatsApp, le site web de l'école ou les réseaux sociaux pour permettre aux parents de remplir le formulaire d'inscription directement depuis leur smartphone.
          </p>

          <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-700">
            <Link2 className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
            <input 
              type="text" 
              readOnly 
              value={publicLink}
              className="bg-transparent text-white font-mono text-xs w-full focus:outline-none"
            />
            <button 
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shrink-0 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copie effectuée' : 'Copier le lien'}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center space-x-3 text-xs">
            <Link 
              href={`/register/${currentSchool.code}`} 
              target="_blank"
              className="text-sky-400 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Tester le formulaire public en direct</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* QR Code Printable Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
          <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-sky-600" />
            <span>Affiche QR Code à Imprimer</span>
          </h3>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code Inscription" className="w-32 h-32 rounded-xl border border-slate-200 p-1" />
          )}
          <button 
            onClick={() => window.print()}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Imprimer l'affiche QR Code
          </button>
        </div>
      </div>

      {/* Registrations Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
          Demandes de Préinscription Reçues
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Candidat</th>
                <th className="p-4">Classe Souhaitée</th>
                <th className="p-4">Parent / Tuteur</th>
                <th className="p-4">Date de soumission</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Traitement Administratif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolRegistrations.map((reg) => {
                const reqClass = classes.find(c => c.id === reg.requestedClassId);
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block text-xs">
                        {reg.candidateFirstName} {reg.candidateLastName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Né(e) le {new Date(reg.dateOfBirth).toLocaleDateString()} à {reg.placeOfBirth}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700 bg-sky-50 text-sky-700 px-2 py-1 rounded-lg text-xs">
                        {reqClass ? reqClass.name : 'Non spécifiée'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="font-semibold">{reg.parentName}</span>
                      <span className="block text-[11px] text-slate-400">{reg.parentPhone}</span>
                    </td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      {new Date(reg.submittedAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {reg.status === 'PENDING' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          <Clock className="w-3 h-3 mr-1" /> En attente
                        </span>
                      )}
                      {reg.status === 'ACCEPTED' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Accepté & Fiche Élève Créée
                        </span>
                      )}
                      {reg.status === 'REJECTED' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          <XCircle className="w-3 h-3 mr-1" /> Refusé
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {reg.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => processRegistration(reg.id, 'ACCEPT')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                          >
                            Accepter & Inscrire
                          </button>
                          <button 
                            onClick={() => processRegistration(reg.id, 'REJECT')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-all"
                          >
                            Refuser
                          </button>
                        </>
                      )}
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
