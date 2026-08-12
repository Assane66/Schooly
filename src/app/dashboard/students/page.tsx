'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/use-app-store';
import { Student } from '@/types';
import { 
  Users, Search, Plus, Upload, Download, FileSpreadsheet, 
  CheckCircle2, X, Eye, Trash2, Edit3, Filter, History, Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function StudentsPage() {
  const { 
    currentSchool, students, classes, addStudent, 
    deleteStudent, importStudents, currentRole 
  } = useAppStore();

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);

  // New student form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '2014-05-15',
    placeOfBirth: 'Dakar',
    gender: 'M' as 'M' | 'F',
    phone: '+221 77 ',
    address: 'Grand Yoff, Dakar',
    classId: classes[0]?.id || ''
  });

  // Filter students for current school tenant
  const schoolStudents = students.filter(s => s.schoolId === currentSchool.id);
  const filteredStudents = schoolStudents.filter(s => {
    const matchesSearch = 
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricule.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.currentClassId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;
    addStudent({
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      placeOfBirth: formData.placeOfBirth,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      currentClassId: formData.classId
    });
    setShowAddModal(false);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '2014-05-15',
      placeOfBirth: 'Dakar',
      gender: 'M',
      phone: '+221 77 ',
      address: 'Grand Yoff, Dakar',
      classId: classes[0]?.id || ''
    });
  };

  // Excel Export simulation
  const handleExportExcel = () => {
    const dataToExport = filteredStudents.map(s => {
      const cls = classes.find(c => c.id === s.currentClassId);
      return {
        Matricule: s.matricule,
        Prénom: s.firstName,
        Nom: s.lastName,
        'Sexe': s.gender,
        'Date de Naissance': s.dateOfBirth,
        'Lieu de Naissance': s.placeOfBirth,
        Classe: cls ? cls.name : 'Non affecté',
        Téléphone: s.phone || '',
        Statut: s.status
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Élèves');
    XLSX.writeFile(workbook, `Eleves_${currentSchool.code}_2025-2026.xlsx`);
  };

  // Excel Import simulator
  const handleSimulateImport = () => {
    const sampleImportData: Partial<Student>[] = [
      { firstName: 'Demba', lastName: 'Gueye', dateOfBirth: '2013-03-11', placeOfBirth: 'Dakar', gender: 'M', address: 'Medina', currentClassId: classes[0]?.id },
      { firstName: 'Ndeye', lastName: 'Seck', dateOfBirth: '2013-07-19', placeOfBirth: 'Thiès', gender: 'F', address: 'Mermoz', currentClassId: classes[0]?.id },
      { firstName: 'Cheikh', lastName: 'Bamba', dateOfBirth: '2012-12-05', placeOfBirth: 'Touba', gender: 'M', address: 'Rufisque', currentClassId: classes[1]?.id },
    ];
    importStudents(sampleImportData);
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Gestion des Élèves</span>
            <span className="text-xs bg-sky-100 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full">
              {filteredStudents.length} élèves
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Répertoire d'élèves, génération de matricules uniques et historique des réinscriptions.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 border border-slate-200"
          >
            <Upload className="w-4 h-4 text-sky-600" />
            <span>Import Excel/CSV</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 border border-emerald-200"
          >
            <Download className="w-4 h-4" />
            <span>Exporter (.xlsx)</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un élève</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, prénom, matricule..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filtrer par classe :</span>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="ALL">Toutes les classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Élève & Matricule</th>
                <th className="p-4">Classe</th>
                <th className="p-4">Sexe / Né(e) le</th>
                <th className="p-4">Lieu & Adresse</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const cls = classes.find(c => c.id === s.currentClassId);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={s.photo} 
                          alt={s.firstName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">
                            {s.firstName} {s.lastName}
                          </span>
                          <span className="font-mono text-[10px] text-sky-600 font-semibold bg-sky-50 px-1.5 py-0.5 rounded">
                            {s.matricule}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                        {cls ? cls.name : 'Non affecté'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="font-bold">{s.gender === 'M' ? 'Garçon' : 'Fille'}</span>
                      <span className="block text-[11px] text-slate-400">{new Date(s.dateOfBirth).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span>{s.placeOfBirth}</span>
                      <span className="block text-[11px] text-slate-400 truncate max-w-xs">{s.address}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button 
                        onClick={() => setSelectedStudentForHistory(s)}
                        title="Voir l'historique scolaire"
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteStudent(s.id)}
                        title="Supprimer"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Ajouter un Élève dans l'Établissement</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prénom *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="ex: Alpha"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nom *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="ex: Ba"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date de Naissance</label>
                  <input 
                    type="date" 
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Genre</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'M' | 'F'})}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  >
                    <option value="M">Masculin (Garçon)</option>
                    <option value="F">Féminin (Fille)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Classe d'affectation</label>
                <select 
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md"
                >
                  Créer l'Élève & Générer Matricule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import Simulation Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Importation Massive d'Élèves (.xlsx / .csv)</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-all">
              <Upload className="w-8 h-8 text-sky-500 mx-auto" />
              <p className="font-bold text-xs text-slate-700">Glissez-déposez le fichier d'élèves Excel ou cliquez pour parcourir</p>
              <p className="text-[11px] text-slate-400">Colonnes supportées: Prénom, Nom, Date de Naissance, Lieu, Sexe, Classe</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Détection automatique des doublons & matricules
              </p>
              <p>Le système attribuera automatiquement un matricule unique unique à chaque nouvel élève importé.</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button 
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Annuler
              </button>
              <button 
                onClick={handleSimulateImport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md"
              >
                Valider l'importation de démonstration (3 élèves)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student History Timeline Drawer */}
      {selectedStudentForHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-sky-600" />
                <span>Historique Scolaire de l'Élève</span>
              </h3>
              <button onClick={() => setSelectedStudentForHistory(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-sky-50 rounded-2xl border border-sky-100">
              <img src={selectedStudentForHistory.photo} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-slate-800">{selectedStudentForHistory.firstName} {selectedStudentForHistory.lastName}</h4>
                <p className="font-mono text-[11px] text-sky-700">{selectedStudentForHistory.matricule}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="relative pl-6 border-l-2 border-sky-500 space-y-1">
                <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-sky-500"></span>
                <span className="font-bold text-slate-800 block">Année 2025-2026 (En cours)</span>
                <p className="text-slate-600">Inscrit en <strong>CM2 A</strong> (Complexe Excellence Dakar)</p>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">Statut: Réglé</span>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-1">
                <span className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="font-bold text-slate-600 block">Année 2024-2025</span>
                <p className="text-slate-500">Admis en <strong>CM1 A</strong> (Moyenne générale : 16.4 / 20)</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedStudentForHistory(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs mt-4"
            >
              Fermer l'historique
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
