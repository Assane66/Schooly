'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { QrCode, Printer, Sparkles, GraduationCap } from 'lucide-react';
import QRCode from 'qrcode';

export default function StudentCardsPage() {
  const { currentSchool, classes, students } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [qrCodeUrls, setQrCodeUrls] = useState<{ [studentId: string]: string }>({});

  const classStudents = students.filter(s => s.currentClassId === selectedClassId);

  useEffect(() => {
    const generateQrs = async () => {
      const urls: { [id: string]: string } = {};
      for (const std of classStudents) {
        try {
          const qrData = `https://app.saas.com/verify-student/${std.matricule}`;
          const url = await QRCode.toDataURL(qrData, { width: 120, margin: 1 });
          urls[std.id] = url;
        } catch (e) {
          console.error(e);
        }
      }
      setQrCodeUrls(urls);
    };

    if (classStudents.length > 0) {
      generateQrs();
    }
  }, [selectedClassId, classStudents]);

  return (
    <div className="space-y-6">
      {/* Header & Print Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Studio de Génération des Cartes Scolaires QR</span>
            <span className="text-xs bg-cyan-100 text-cyan-800 font-semibold px-2.5 py-0.5 rounded-full">
              Génération Massive
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Création de cartes d'identité d'élèves sécurisées avec QR Code dynamique de contrôle.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer {classStudents.length} Cartes Scolaires (PDF)</span>
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3 text-xs no-print">
        <span className="font-semibold text-slate-700">Sélectionner la Classe :</span>
        <select 
          value={selectedClassId} 
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
        >
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Printable Grid of Student Cards (Sections 32-34 of CAHIER DES CHARGES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {classStudents.map((std) => {
          const cls = classes.find(c => c.id === std.currentClassId);
          const qrUrl = qrCodeUrls[std.id];

          return (
            <div 
              key={std.id}
              className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-5 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden flex flex-col justify-between h-56 print:break-inside-avoid print:border-slate-800"
            >
              {/* Top School Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <img src={currentSchool.logo} className="w-8 h-8 rounded-lg object-cover bg-white" />
                  <div>
                    <h4 className="font-bold text-[11px] text-white leading-tight uppercase truncate max-w-[170px]">{currentSchool.name}</h4>
                    <span className="text-[9px] text-sky-400 font-semibold block">CARTE SCOLAIRE OFFICIELLE</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">2025-2026</span>
              </div>

              {/* Center Profile & Info */}
              <div className="flex items-center space-x-3 py-2">
                <img 
                  src={std.photo} 
                  alt={std.firstName} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/50 shadow-md shrink-0" 
                />
                <div className="space-y-0.5 overflow-hidden">
                  <h3 className="font-extrabold text-sm text-white truncate">{std.firstName} {std.lastName}</h3>
                  <span className="text-[11px] font-semibold text-slate-300 block">Classe : {cls?.name}</span>
                  <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded inline-block">
                    {std.matricule}
                  </span>
                </div>
              </div>

              {/* Bottom Verification QR Code */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Scanner pour vérifier l'identité</span>
                {qrUrl && (
                  <img src={qrUrl} className="w-10 h-10 rounded bg-white p-0.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
