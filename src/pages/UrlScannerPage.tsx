import React, { useState } from 'react';
import { ScanResult } from '../types';
import { heuristicAnalyzeUrl } from '../utils/urlUtils';
import { storage } from '../utils/storage';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScoreGauge } from '../components/RiskScoreGauge';
import {
  Link2,
  ShieldAlert,
  ShieldCheck,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  ExternalLink,
  Save,
  Globe,
  Lock,
  Unlock,
} from 'lucide-react';

interface UrlScannerPageProps {
  onScanCompleted: (result: ScanResult) => void;
}

export const UrlScannerPage: React.FC<UrlScannerPageProps> = ({ onScanCompleted }) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);

  const sampleUrls = [
    { label: 'PayPal Phishing Scam', url: 'http://login.paypal-account-security-update.xyz/verify' },
    { label: 'Legitimate Google Domain', url: 'https://accounts.google.com/signin' },
    { label: 'Typosquatted Bank Domain', url: 'https://www.bankofamerica-secure-login.top/account' },
    { label: 'Raw IP Address Host', url: 'http://192.168.1.100/admin/login.php' },
  ];

  const handleExecuteScan = async (targetUrl?: string) => {
    const urlToScan = (targetUrl || urlInput).trim();
    if (!urlToScan || isScanning) return;

    setIsScanning(true);
    setCurrentResult(null);

    try {
      const response = await fetch('/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToScan }),
      });

      let aiResult = await response.json();

      // If backend returned demo mode or error, use local heuristic fallback
      if (aiResult.isDemo || aiResult.error || !aiResult.riskScore) {
        const localPartial = heuristicAnalyzeUrl(urlToScan);
        aiResult = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'url',
          target: urlToScan,
          riskScore: localPartial.riskScore || 50,
          riskLevel: localPartial.riskLevel || 'suspicious',
          summary: localPartial.summary || 'URL Evaluation Complete',
          flags: localPartial.flags || [],
          explanation: localPartial.explanation || 'Analyzed via heuristic domain rules.',
          recommendations: localPartial.recommendations || ['Verify origin before interacting.'],
        };
      } else {
        aiResult.id = `scan-${Date.now()}`;
        aiResult.timestamp = new Date().toISOString();
        aiResult.type = 'url';
        aiResult.target = urlToScan;
      }

      setCurrentResult(aiResult);
      storage.saveScan(aiResult);
      onScanCompleted(aiResult);
    } catch (err) {
      console.error('URL scan error:', err);
      // Fallback to local heuristic
      const localPartial = heuristicAnalyzeUrl(urlToScan);
      const fallbackResult: ScanResult = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'url',
        target: urlToScan,
        riskScore: localPartial.riskScore || 50,
        riskLevel: localPartial.riskLevel || 'suspicious',
        summary: localPartial.summary || 'URL Scan Evaluation',
        flags: localPartial.flags || [],
        explanation: localPartial.explanation || 'Evaluated via domain heuristics.',
        recommendations: localPartial.recommendations || ['Exercise caution.'],
      };
      setCurrentResult(fallbackResult);
      storage.saveScan(fallbackResult);
      onScanCompleted(fallbackResult);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Link2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              AI Domain & URL Analyzer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            Phishing & Typosquatting Scanner
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter any target domain or web link to inspect for SSL security, brand impersonation, typosquatting tricks, deceptive subdomains, and malicious social engineering parameters.
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteScan();
          }}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter URL e.g. http://login.paypal-account-security-update.xyz/verify"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-11 pr-4 py-3.5 text-slate-100 text-sm font-mono placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!urlInput.trim() || isScanning}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
          >
            {isScanning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>Scanning Domain...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan URL</span>
              </>
            )}
          </button>
        </form>

        {/* Sample URLs */}
        <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-mono text-slate-400 text-[11px]">Test Sample URLs:</span>
          {sampleUrls.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(sample.url);
                handleExecuteScan(sample.url);
              }}
              disabled={isScanning}
              className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 font-mono transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State Skeleton */}
      {isScanning && (
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center space-y-4">
          <Sparkles className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-100 text-base">Gemini AI Threat Inspection in Progress</h3>
            <p className="text-xs text-slate-400 font-mono">
              Evaluating SSL certificates, TLD reputation, typosquatting vectors, and parameter obfuscation...
            </p>
          </div>
        </div>
      )}

      {/* Scan Results Card */}
      {currentResult && !isScanning && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 space-y-6 shadow-xl animate-fadeIn">
          {/* Header Verdict */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-5">
              <RiskScoreGauge score={currentResult.riskScore} riskLevel={currentResult.riskLevel} size={110} />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <RiskBadge level={currentResult.riskLevel} size="lg" />
                  <span className="text-xs font-mono text-slate-400">Target: {currentResult.target}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 font-sans">{currentResult.summary}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  Scan Completed on {new Date(currentResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Protocol Status</span>
              <p className="text-sm font-mono font-bold text-slate-200 mt-0.5 flex items-center justify-end gap-1.5">
                {currentResult.target.startsWith('https://') ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">HTTPS Encrypted</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-400">HTTP Unencrypted</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Detailed Threat Explanation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> AI Intelligence Analysis
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{currentResult.explanation}</p>
          </div>

          {/* Grid: Risk Flags + Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Flags */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Detected Risk Flags
              </h3>
              <div className="space-y-2.5">
                {currentResult.flags.map((flag, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs">{flag.title}</span>
                      <RiskBadge level={flag.severity} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-cyan-400" /> Recommended Action Plan
              </h3>
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-3">
                {currentResult.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
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
};
