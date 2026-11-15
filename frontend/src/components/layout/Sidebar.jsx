import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  PackageSearch,
  BookOpenCheck,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'allocation', label: 'Book a Space', icon: CalendarDays },
    { id: 'lostfound', label: 'Lost & Found', icon: PackageSearch },
  ];

  const subItems = [
    { id: 'my-bookings', label: 'My Bookings', icon: BookOpenCheck },
    { id: 'my-reports', label: 'My Reports', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation List */}
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
            Main Portal
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest text-white shadow-sm'
                      : 'text-navy-700 hover:bg-canvas-alt hover:text-navy-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-navy-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
            Personal Records
          </div>
          <nav className="space-y-1">
            {subItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest text-white'
                      : 'text-navy-700 hover:bg-canvas-alt hover:text-navy-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-navy-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Support Card */}
      <div className="p-4 border-t border-border">
        <div className="p-3 rounded-lg bg-canvas-alt border border-border/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-navy-800 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-forest" />
            <span>Campus Help Desk</span>
          </div>
          <p className="text-[11px] text-navy-500 leading-relaxed mb-2">
            Need assistance with room keys, facility equipment, or security office claims?
          </p>
          <div className="text-[10px] font-medium text-forest hover:underline flex items-center gap-1 cursor-pointer">
            <span>Contact Facilities Support</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </aside>
  );
}
