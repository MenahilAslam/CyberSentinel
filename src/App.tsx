/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, ScanResult, AppSettings, UserProfile } from './types';
import { storage } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { RiskBadge } from './components/RiskBadge';
import { RiskScoreGauge } from './components/RiskScoreGauge';

import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { EmailAnalyzerPage } from './pages/EmailAnalyzerPage';
import { PasswordAnalyzerPage } from './pages/PasswordAnalyzerPage';
import { LearningHubPage } from './pages/LearningHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

import { X, ShieldAlert, CheckCircle2, ListChecks, Calendar, ExternalLink } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [scans, setScans] = useState<ScanResult[]>(() => storage.getScans());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [selectedScanDetails, setSelectedScanDetails] = useState<ScanResult | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleScanCompleted = (newScan: ScanResult) => {
    const updated = storage.getScans();
    setScans(updated);
    setProfile(storage.getProfile());
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to purge all local audit records?')) {
      storage.clearScans();
      setScans([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activePage={activePage}
          onSelectPage={(page) => {
            setActivePage(page);
            setMobileMenuOpen(false);
          }}
          scansCount={scans.length}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex">
          <div className="w-72 bg-slate-900 border-r border-slate-800 h-full overflow-y-auto">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <Sidebar
              activePage={activePage}
              onSelectPage={(page) => {
                setActivePage(page);
                setMobileMenuOpen(false);
              }}
              scansCount={scans.length}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0">
        <Navbar
          activePage={activePage}
          onSelectPage={(page) => setActivePage(page)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          userName={profile.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activePage === 'dashboard' && (
            <DashboardPage
              scans={scans}
              onSelectPage={(page) => setActivePage(page)}
              onSelectScanDetails={(scan) => setSelectedScanDetails(scan)}
            />
          )}

          {activePage === 'assistant' && <AssistantPage />}

          {activePage === 'url-scanner' && (
            <UrlScannerPage onScanCompleted={handleScanCompleted} />
          )}

          {activePage === 'email-analyzer' && (
            <EmailAnalyzerPage onScanCompleted={handleScanCompleted} />
          )}

          {activePage === 'password-analyzer' && (
            <PasswordAnalyzerPage onScanCompleted={handleScanCompleted} />
          )}

          {activePage === 'learning-hub' && <LearningHubPage />}

          {activePage === 'profile' && (
            <ProfilePage
              scans={scans}
              onSelectScanDetails={(scan) => setSelectedScanDetails(scan)}
              onProfileUpdated={(p) => setProfile(p)}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              settings={settings}
              onSettingsUpdated={(s) => setSettings(s)}
              onClearHistory={handleClearHistory}
            />
          )}

          {activePage === 'about' && <AboutPage />}
        </main>

        <Footer onSelectPage={(page) => setActivePage(page)} />
      </div>

      {/* Mobile Bottom Navigation Bar (ONLY on Mobile) */}
      <BottomNav
        activePage={activePage}
        onSelectPage={(page) => setActivePage(page)}
      />

      {/* Detailed Scan Record Modal */}
      {selectedScanDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative custom-scrollbar">
            <button
              onClick={() => setSelectedScanDetails(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-lg bg-slate-800/80 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <RiskScoreGauge score={selectedScanDetails.riskScore} riskLevel={selectedScanDetails.riskLevel} size={90} />
              <div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={selectedScanDetails.riskLevel} size="md" />
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold">{selectedScanDetails.type} Audit</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-sans mt-1">{selectedScanDetails.summary}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedScanDetails.target}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> AI Threat Explanation
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">{selectedScanDetails.explanation}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Detected Risk Flags</h4>
              <div className="space-y-2">
                {selectedScanDetails.flags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{flag.title}</span>
                      <RiskBadge level={flag.severity} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Recommended Action Steps</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                {selectedScanDetails.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
