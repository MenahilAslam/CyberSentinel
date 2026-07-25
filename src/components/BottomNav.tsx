import React from 'react';
import { PageId } from '../types';
import { LayoutDashboard, Bot, ScanLine, User } from 'lucide-react';

interface BottomNavProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onSelectPage }) => {
  const navItems: { id: PageId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'url-scanner', label: 'Scanner', icon: ScanLine },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-md px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activePage === item.id ||
          (item.id === 'url-scanner' &&
            ['url-scanner', 'email-analyzer', 'password-analyzer'].includes(activePage));

        return (
          <button
            key={item.id}
            onClick={() => onSelectPage(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-cyan-400 font-semibold bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-mono mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
