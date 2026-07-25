import React, { useState } from 'react';
import { AppSettings } from '../types';
import { storage } from '../utils/storage';
import {
  Settings as SettingsIcon,
  Moon,
  Bell,
  Database,
  Key,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  Save,
} from 'lucide-react';

interface SettingsPageProps {
  settings: AppSettings;
  onSettingsUpdated: (newSettings: AppSettings) => void;
  onClearHistory: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSettingsUpdated,
  onClearHistory,
}) => {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    storage.saveSettings(currentSettings);
    onSettingsUpdated(currentSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportJSON = () => {
    const data = {
      scans: storage.getScans(),
      profile: storage.getProfile(),
      settings: storage.getSettings(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybersentinel_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <SettingsIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Control Panel & System Parameters
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            CyberSentinel Settings
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Manage UI themes, AI model proxy preferences, notification alert thresholds, export security reports, and local database storage.
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Gemini API Status Box */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="font-bold text-slate-100 text-base font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Google Gemini AI API Configuration
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            CyberSentinel AI connects directly to Google Gemini 3.6 Flash via server-side endpoints. Your API key is loaded automatically from environment variables.
          </p>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs font-mono text-slate-400 space-y-1">
            <p>
              <strong className="text-slate-200">SDK Engine:</strong> @google/genai (^2.4.0)
            </p>
            <p>
              <strong className="text-slate-200">Active Model:</strong> gemini-3.6-flash
            </p>
            <p>
              <strong className="text-slate-200">Key Location:</strong> Configured in AI Studio Secrets panel (<code className="text-cyan-400">GEMINI_API_KEY</code>)
            </p>
          </div>
        </div>

        {/* UI & Notifications */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-100 text-base font-sans flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Moon className="w-4 h-4 text-cyan-400" /> Interface & Preferences
          </h3>

          <div className="space-y-4 text-xs font-mono">
            {/* Theme Select */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div>
                <span className="text-slate-200 font-bold block">Dashboard Visual Theme</span>
                <span className="text-slate-400 text-[11px]">Select cybersecurity color palette</span>
              </div>
              <select
                value={currentSettings.theme}
                onChange={(e) => setCurrentSettings({ ...currentSettings, theme: e.target.value as any })}
                className="bg-slate-900 border border-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-mono"
              >
                <option value="dark-navy">Dark Navy + Cyan (Default)</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
                <option value="deep-slate">Deep Obsidian Slate</option>
              </select>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div>
                <span className="text-slate-200 font-bold block">Security Threat Notifications</span>
                <span className="text-slate-400 text-[11px]">Display toast popups for detected critical threats</span>
              </div>
              <input
                type="checkbox"
                checked={currentSettings.notificationsEnabled}
                onChange={(e) => setCurrentSettings({ ...currentSettings, notificationsEnabled: e.target.checked })}
                className="accent-cyan-400 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Database & Export */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-100 text-base font-sans flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Database className="w-4 h-4 text-cyan-400" /> Local History & Report Export
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Report</span>
            </button>

            <button
              onClick={onClearHistory}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/60 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Audit Database</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Settings Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

        {/* Developer Info Footer */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-semibold text-slate-300">Developed by Menahil Aslam</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
            Version 1.0
          </span>
        </div>
      </div>
    </div>
  );
};
