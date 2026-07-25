import React from 'react';
import { PageId } from '../types';
import { Shield, Bell, Search, Menu, Sparkles, UserCheck, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  onToggleMobileMenu: () => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  onToggleMobileMenu,
  userName,
}) => {
  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    dashboard: { title: 'Security Command Center', subtitle: 'Real-time threat status & active telemetry' },
    assistant: { title: 'AI Security Assistant', subtitle: 'Powered by Google Gemini 3.6 Flash' },
    'url-scanner': { title: 'Phishing URL Scanner', subtitle: 'Detect domain trickery & phishing indicators' },
    'email-analyzer': { title: 'Scam Email Analyzer', subtitle: 'Analyze raw email body and header headers' },
    'password-analyzer': { title: 'Password Entropy Audit', subtitle: 'Measure strength, pattern risks & generate keys' },
    'learning-hub': { title: 'Cybersecurity Learning Hub', subtitle: 'Interactive modules & threat assessments' },
    profile: { title: 'SecOps User Profile', subtitle: 'Security score, credentials & badges' },
    settings: { title: 'System Settings', subtitle: 'Preferences, notifications & Gemini API status' },
    about: { title: 'About CyberSentinel AI', subtitle: 'Architecture & cybersecurity intelligence specs' },
  };

  const currentMeta = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title & Navigation Controls */}
      <div className="flex items-center gap-3">
        {/* Back Arrow for Non-Dashboard Pages */}
        {activePage !== 'dashboard' && (
          <button
            onClick={() => onSelectPage('dashboard')}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400" />
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 font-sans tracking-tight">
            {currentMeta.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-400 font-mono">{currentMeta.subtitle}</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick AI Assistant Button */}
        {activePage !== 'assistant' && (
          <button
            onClick={() => onSelectPage('assistant')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:border-cyan-400/60 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Ask Gemini AI</span>
          </button>
        )}

        {/* User Profile Button */}
        <button
          onClick={() => onSelectPage('profile')}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs font-mono">
            {userName ? userName.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="hidden md:inline text-slate-300 font-mono text-xs">{userName || 'SecOps User'}</span>
        </button>
      </div>
    </header>
  );
};
