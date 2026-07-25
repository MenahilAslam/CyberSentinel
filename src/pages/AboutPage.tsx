import React from 'react';
import {
  Shield,
  Bot,
  Zap,
  Lock,
  Cpu,
  Globe,
  FileCode,
  CheckCircle2,
  ExternalLink,
  User,
  GraduationCap,
  Award,
  Code2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Shield className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight font-sans">CyberSentinel AI</h1>
              <p className="text-sm font-mono text-cyan-400 font-semibold">AI-Powered Enterprise Cybersecurity Intelligence</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            CyberSentinel AI is an enterprise-grade cybersecurity intelligence application designed to protect organizations and users against phishing links, email scams, credential harvesting, and zero-day threat vectors. Powered by Google Gemini AI and built on serverless architecture.
          </p>
        </div>
      </div>

      {/* Developer Information Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base font-sans">About Developer</h3>
              <p className="text-xs text-slate-400 font-mono">Developed by Menahil Aslam</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Version 1.0
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Profile Details */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Developer Name</span>
              <p className="text-base font-bold text-slate-100 font-sans">Menahil Aslam</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Education</span>
              <p className="text-sm font-semibold text-cyan-300 font-sans flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" /> BS Computer Science
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Specialization</span>
              <p className="text-sm font-semibold text-slate-200 font-sans flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400 shrink-0" /> AI & Cybersecurity
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Project</span>
              <p className="text-xs font-mono text-slate-300">
                CyberSentinel AI – AI-Powered Enterprise Cybersecurity Platform
              </p>
            </div>
          </div>

          {/* Tech Stack List */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-400" /> Technologies Used
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> React
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Vite
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> TypeScript
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Tailwind CSS
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Google Gemini AI
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Vercel
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Technical Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Engine Specs */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base font-sans">AI Reasoning Engine</h3>
          </div>

          <ul className="space-y-2.5 text-xs font-mono text-slate-300">
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Model:</span>
              <span className="text-cyan-400 font-bold">Google Gemini 3.6 Flash</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">SDK:</span>
              <span className="text-slate-200">@google/genai (^2.4.0)</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Architecture:</span>
              <span className="text-slate-200">Server-Side API Proxy (/api/*)</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Output Specs:</span>
              <span className="text-slate-200">JSON Schema Enforced</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Stack Architecture */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base font-sans">Deployment & Frontend</h3>
          </div>

          <ul className="space-y-2.5 text-xs font-mono text-slate-300">
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Frontend:</span>
              <span className="text-slate-200">React 19, TypeScript, Vite</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Styling:</span>
              <span className="text-slate-200">Tailwind CSS v4</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Serverless Functions:</span>
              <span className="text-slate-200">Vercel / Node Serverless</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80">
              <span className="text-slate-400">Hosting Compatibility:</span>
              <span className="text-emerald-400 font-bold">GitHub & Vercel Native</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Principles & Privacy */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4 shadow-xl">
        <h3 className="font-bold text-slate-100 text-base font-sans flex items-center gap-2 pb-3 border-b border-slate-800/80">
          <Lock className="w-5 h-5 text-emerald-400" /> Security & Privacy Guarantees
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-slate-200 text-sm">Zero API Key Leakage</h4>
            <p className="text-slate-400">
              All Gemini API keys remain strictly server-side in environment variables. No credentials are ever exposed to the client browser.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-slate-200 text-sm">Zero Log Retention</h4>
            <p className="text-slate-400">
              Audited URL targets and email bodies are evaluated ephemerally and never written to permanent external databases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-slate-200 text-sm">Vercel & GitHub Native</h4>
            <p className="text-slate-400">
              Built with standard serverless endpoints (`/api/*`), enabling zero-config deployment on Vercel and GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
