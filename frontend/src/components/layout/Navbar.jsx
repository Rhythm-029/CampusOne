import React from 'react';
import { Bell, Home, ArrowLeft } from 'lucide-react';

export default function Navbar({ onNavigate, activeTab, onReturnToLanding }) {
  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Brand Identity / Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReturnToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-navy-500 hover:text-forest transition-colors p-1 rounded hover:bg-canvas-alt"
          title="Return to Public Landing Page"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing</span>
        </button>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <img src="/assets/college-logo.png" alt="ATLAS SkillTech University" className="h-6 w-auto object-contain" />
          <span className="font-display font-bold text-lg tracking-tight text-navy-900">CampusOne</span>
          <span className="hidden md:inline-block ml-1 px-2 py-0.5 text-[10px] font-semibold bg-canvas-alt text-navy-500 rounded border border-border">
            Student Portal
          </span>
        </div>
      </div>

      {/* Right Controls: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-navy-500 hover:text-navy-900 hover:bg-canvas-alt rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full ring-2 ring-surface" />
        </button>

        <div className="h-5 w-px bg-border" />

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-forest-light text-forest font-semibold text-xs flex items-center justify-center border border-forest/20">
            AS
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-navy-900 leading-tight">Ananya Sharma</div>
            <div className="text-[11px] text-navy-500 flex items-center gap-1">
              <span>B.Tech CS (Sem V)</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" title="Verified Campus Account" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
