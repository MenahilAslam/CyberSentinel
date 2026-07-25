import React, { useState } from 'react';
import { PageId, ScanResult, ThreatAlert } from '../types';
import { INITIAL_THREAT_FEED } from '../data/threatFeed';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScoreGauge } from '../components/RiskScoreGauge';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Link2,
  MailWarning,
  KeyRound,
  Bot,
  Activity,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';

interface DashboardPageProps {
  scans: ScanResult[];
  onSelectPage: (page: PageId) => void;
  onSelectScanDetails: (scan: ScanResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  scans,
  onSelectPage,
  onSelectScanDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [threatFeed, setThreatFeed] = useState<ThreatAlert[]>(INITIAL_THREAT_FEED);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalScans = scans.length;
  const dangerousCount = scans.filter((s) => s.riskScore >= 75).length;
  const suspiciousCount = scans.filter((s) => s.riskScore >= 40 && s.riskScore < 75).length;
  const safeCount = scans.filter((s) => s.riskScore < 40).length;

  const threatLevel = dangerousCount > 2 ? 'CRITICAL' : dangerousCount > 0 ? 'ELEVATED' : 'NORMAL';

  const categories = ['All', 'Zero-Day', 'Phishing', 'Ransomware', 'Vulnerability'];

  const filteredFeed =
    selectedCategory === 'All'
      ? threatFeed
      : threatFeed.filter((item) => item.category === selectedCategory);

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Cyber Threat Matrix */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Threat Index Matrix
              </span>
              <span className="text-xs font-mono text-slate-400">Refreshed Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
              CyberSentinel Intelligence Center
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-driven defense monitoring, automated URL phishing inspection, email scam analysis, and Gemini SecOps reasoning.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/90 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Global Threat Index</span>
              <div className="flex items-center justify-end gap-2 mt-0.5">
                <span
                  className={`text-lg font-black font-mono tracking-wider ${
                    threatLevel === 'CRITICAL'
                      ? 'text-rose-400'
                      : threatLevel === 'ELEVATED'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {threatLevel}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-ping ${
                    threatLevel === 'CRITICAL'
                      ? 'bg-rose-500'
                      : threatLevel === 'ELEVATED'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Threats Neutralized</span>
              <p className="text-lg font-black font-mono text-cyan-400">{dangerousCount + suspiciousCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: AI Assistant */}
        <div
          onClick={() => onSelectPage('assistant')}
          className="group cursor-pointer rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Consult Gemini 3.6 for incident response and security logic.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Launch Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: URL Scanner */}
        <div
          onClick={() => onSelectPage('url-scanner')}
          className="group cursor-pointer rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-blue-300 transition-colors">
                Phishing URL Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Analyze domain tricks, typosquatting & malicious links.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Scan URL</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Email Analyzer */}
        <div
          onClick={() => onSelectPage('email-analyzer')}
          className="group cursor-pointer rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
              <MailWarning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-amber-300 transition-colors">
                Email Scam Analyzer
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Detect BEC, phishing headers, spoofing & wire scams.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Analyze Email</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Password Audit */}
        <div
          onClick={() => onSelectPage('password-analyzer')}
          className="group cursor-pointer rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-300 transition-colors">
                Password Analyzer
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Test entropy bits, crack times & generate secure keys.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Audit Password</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Threat Alerts Feed + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Scans Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-sans">Recent Security Audits</h3>
                <p className="text-xs text-slate-400 font-mono">Recorded scan history & risk evaluations</p>
              </div>
              <button
                onClick={() => onSelectPage('url-scanner')}
                className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>New Scan</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {scans.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/40 rounded-lg border border-slate-800/60 text-slate-400 space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-medium">No Security Audits Executed Yet</p>
                <p className="text-xs text-slate-500">Run a URL or Email scan to log your first report.</p>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-x-auto">
                {scans.slice(0, 5).map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => onSelectScanDetails(scan)}
                    className="group cursor-pointer p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-md shrink-0 ${
                          scan.type === 'url'
                            ? 'bg-blue-500/10 text-blue-400'
                            : scan.type === 'email'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {scan.type === 'url' ? (
                          <Link2 className="w-4 h-4" />
                        ) : scan.type === 'email' ? (
                          <MailWarning className="w-4 h-4" />
                        ) : (
                          <KeyRound className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200 text-sm truncate max-w-xs group-hover:text-cyan-300 transition-colors">
                            {scan.target}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{scan.summary}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <RiskBadge level={scan.riskLevel} />
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Live Threat Intelligence Feed */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Live Threat Advisories
                </h3>
                <p className="text-xs text-slate-400 font-mono">CVE Bulletins & Threat Trends</p>
              </div>
              <button
                onClick={handleRefreshFeed}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-800/60 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                title="Refresh Feed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-md border whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Advisory Cards */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
              {filteredFeed.map((threat) => (
                <div
                  key={threat.id}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                      {threat.cveId || threat.category}
                    </span>
                    <RiskBadge level={threat.severity} size="sm" />
                  </div>
                  <h4 className="font-bold text-slate-200 text-xs leading-snug">{threat.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{threat.summary}</p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {threat.date}
                    </span>
                    <span className="text-cyan-400/80">Rec: {threat.recommendation.slice(0, 35)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
