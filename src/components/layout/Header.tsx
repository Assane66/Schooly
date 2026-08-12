'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/use-app-store';
import { 
  Search, Bell, Plus, User, ShieldCheck, Sparkles, 
  School, Calendar, ChevronDown, CheckCircle2 
} from 'lucide-react';

export function Header() {
  const { currentSchool, currentUser, currentRole } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm no-print">
      {/* Left Search Bar */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un élève, un matricule (ex: ELV-2026-00001), une classe..."
            className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all border border-transparent focus:border-sky-500/50"
          />
        </div>
      </div>

      {/* Right User & Context Badges */}
      <div className="flex items-center space-x-4">
        {/* Onboarding Wizard Link */}
        <Link 
          href="/onboarding"
          className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Assistant Configuration (Onboarding)</span>
        </Link>

        {/* Academic Year Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs">
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span className="font-semibold text-slate-700">2025 - 2026</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-800 text-xs">Notifications Récentes</h3>
                <span className="text-[10px] bg-sky-100 text-sky-700 font-semibold px-2 py-0.5 rounded-full">3 nouvelles</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-800">Paiement enregistré</p>
                    <p className="text-slate-500 text-[11px]">35 000 FCFA reçu de Alpha Ba par Wave.</p>
                    <span className="text-[10px] text-slate-400">Il y a 10 min</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-800">Nouvelle demande d'inscription</p>
                    <p className="text-slate-500 text-[11px]">Samba Diallo a soumis un dossier pour CM2 A.</p>
                    <span className="text-[10px] text-slate-400">Il y a 1 heure</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-500/20"
          />
          <div className="hidden lg:block text-left">
            <h4 className="text-xs font-bold text-slate-800 leading-snug">{currentUser.name}</h4>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] text-slate-500 font-medium">{currentRole}</span>
              <CheckCircle2 className="w-3 h-3 text-sky-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
