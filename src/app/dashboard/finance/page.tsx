'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { Payment } from '@/types';
import { 
  CreditCard, DollarSign, Plus, Printer, AlertCircle, 
  CheckCircle2, ArrowUpRight, Filter, Search, X, Sparkles 
} from 'lucide-react';

export default function FinancePage() {
  const { currentSchool, payments, students, addPayment } = useAppStore();

  const schoolPayments = payments.filter(p => p.schoolId === currentSchool.id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<Payment | null>(null);

  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: 35000,
    month: 'Novembre 2025',
    paymentMethod: 'WAVE' as 'WAVE' | 'ORANGE_MONEY' | 'CASH' | 'CHEQUE',
    reference: `WAV-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPay = addPayment({
      studentId: formData.studentId,
      amount: formData.amount,
      month: formData.month,
      paymentMethod: formData.paymentMethod,
      reference: formData.reference,
      status: 'REGLE'
    });
    setShowAddModal(false);
    setSelectedReceiptPayment(newPay);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Gestion Financière & Comptabilité</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Paiements & Reçus FCFA
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Encaissement de la scolarité, traçabilité des versements et génération de reçus officiels.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link 
            href="/dashboard/finance/unpaid"
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200 transition-all flex items-center space-x-1.5"
          >
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Consulter les Impayés</span>
          </Link>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Enregistrer un Règlement</span>
          </button>
        </div>
      </div>

      {/* Payments History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800 flex items-center justify-between">
          <span>Historique des Versements Reçus</span>
          <span className="text-xs text-slate-500 font-medium">Devise : FCFA (XOF)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Matricule</th>
                <th className="p-4">Mois Concerné</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Mode & Référence</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Reçu de Paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolPayments.map((pay) => {
                const std = students.find(s => s.id === pay.studentId);
                return (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block text-xs">
                        {std ? `${std.firstName} ${std.lastName}` : 'Élève'}
                      </span>
                      <span className="font-mono text-[10px] text-sky-600 font-semibold">
                        {std?.matricule}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{pay.month}</td>
                    <td className="p-4 font-extrabold text-slate-900 text-sm">
                      {pay.amount.toLocaleString()} FCFA
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] block w-max">
                        {pay.paymentMethod}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{pay.reference}</span>
                    </td>
                    <td className="p-4">
                      {pay.status === 'REGLE' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Réglé
                        </span>
                      )}
                      {pay.status === 'PARTIEL' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          Partiel
                        </span>
                      )}
                      {pay.status === 'EN_RETARD' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          En Retard
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedReceiptPayment(pay)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimer Reçu</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Enregistrer un Encaisser Scolarité</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sélectionner l'Élève *</label>
                <select 
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.matricule})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Montant (FCFA) *</label>
                  <input 
                    type="number" 
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mois concerné *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    placeholder="ex: Novembre 2025"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mode de Règlement *</label>
                  <select 
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-semibold"
                  >
                    <option value="WAVE">Wave Digital</option>
                    <option value="ORANGE_MONEY">Orange Money</option>
                    <option value="CASH">Espèces / Cash</option>
                    <option value="CHEQUE">Chèque bancaire</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Référence Transaction</label>
                  <input 
                    type="text" 
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md"
                >
                  Valider & Générer le Reçu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal (Section 30 of CAHIER DES CHARGES) */}
      {selectedReceiptPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <img src={currentSchool.logo} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 uppercase">{currentSchool.name}</h4>
                  <p className="text-[11px] text-slate-500">Reçu Officiel de Paiement de Scolarité</p>
                </div>
              </div>
              <button onClick={() => setSelectedReceiptPayment(null)} className="text-slate-400 no-print">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Reçu N° :</span>
                <span className="font-mono font-bold text-sky-700">{selectedReceiptPayment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Élève :</span>
                <span className="font-bold text-slate-800">
                  {students.find(s => s.id === selectedReceiptPayment.studentId)?.firstName} {students.find(s => s.id === selectedReceiptPayment.studentId)?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matricule :</span>
                <span className="font-mono font-bold text-slate-700">
                  {students.find(s => s.id === selectedReceiptPayment.studentId)?.matricule}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Motif :</span>
                <span className="font-semibold text-slate-800">Mensualité {selectedReceiptPayment.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Moyen de paiement :</span>
                <span className="font-semibold text-slate-800">{selectedReceiptPayment.paymentMethod}</span>
              </div>
              <hr className="border-slate-200 my-2" />
              <div className="flex justify-between text-sm">
                <span className="font-extrabold text-slate-900">MONTANT PAYÉ :</span>
                <span className="font-black text-emerald-600">{selectedReceiptPayment.amount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Date d'émission :</span>
                <span className="font-bold text-slate-700">{new Date(selectedReceiptPayment.date).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Signature & Cachet :</span>
                <span className="font-mono text-[10px] text-slate-500 italic">[Validé en ligne]</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 no-print">
              <button 
                onClick={() => window.print()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le Reçu PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
