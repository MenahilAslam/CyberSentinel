import React from 'react';
import { PageId } from '../types';
import {
  LayoutDashboard,
  Bot,
  Link2,
  MailWarning,
  KeyRound,
  GraduationCap,
  User,
  Settings,
  Info,
  Shield,
  Activity,
  Radio,
} from 'lucide-react';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  scansCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage, scansCount }) => {
  const navItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Security Assistant', icon: Bot, badge: 'Gemini' },
    { id: 'url-scanner', label: 'Phishing URL Scanner', icon: Link2 },
    { id: 'email-analyzer', label: 'Scam Email Analyzer', icon: MailWarning },
    { id: 'password-analyzer', label: 'Password Strength', icon: KeyRound },
    { id: 'learning-hub', label: 'Learning Hub', icon: GraduationCap },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About CyberSentinel', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800/80 flex flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20">
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-lg text-slate-100 tracking-tight font-sans">CyberSentinel</h1>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Cybersecurity Assistant</p>
        </div>
      </div>

      {/* Live System Status Pill */}
      <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-950/80 border border-slate-800/90 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-slate-300 font-medium">System Active</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
          NORMAL
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Stats */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs font-mono text-slate-400 space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Total Scans
          </span>
          <span className="text-slate-200 font-bold">{scansCount}</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400" /> AI Engine
          </span>
          <span className="text-emerald-400 font-medium">Gemini 3.6</span>
        </div>
      </div>
    </aside>
  );
};
