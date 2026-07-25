import React from 'react';
import { Shield, Lock, Cpu, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectPage: (page: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPage }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-500 py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-300 font-sans">CyberSentinel AI</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-[11px] text-slate-400">Developed by Menahil Aslam © 2026</span>
        </div>

        {/* Center links */}
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <button onClick={() => onSelectPage('about')} className="hover:text-cyan-400 transition-colors">
            Architecture
          </button>
          <button onClick={() => onSelectPage('learning-hub')} className="hover:text-cyan-400 transition-colors">
            Learning Hub
          </button>
          <button onClick={() => onSelectPage('settings')} className="hover:text-cyan-400 transition-colors">
            Settings & Secrets
          </button>
        </div>

        {/* Right status */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            <Cpu className="w-3 h-3" /> Gemini 3.6 Flash
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 text-cyan-400" /> SSL Encrypted
          </span>
        </div>
      </div>
    </footer>
  );
};
