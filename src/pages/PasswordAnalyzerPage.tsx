import React, { useState, useEffect } from 'react';
import { analyzePassword, generatePassword, PasswordAnalysis } from '../utils/passwordUtils';
import { storage } from '../utils/storage';
import { ScanResult } from '../types';
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Sparkles,
  Lock,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PasswordAnalyzerPageProps {
  onScanCompleted: (result: ScanResult) => void;
}

export const PasswordAnalyzerPage: React.FC<PasswordAnalyzerPageProps> = ({ onScanCompleted }) => {
  const [password, setPassword] = useState<string>('Cyb3r#Guard!2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis>(() => analyzePassword('Cyb3r#Guard!2026'));
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Generator Options
  const [genLength, setGenLength] = useState<number>(18);
  const [genUpper, setGenUpper] = useState<boolean>(true);
  const [genLower, setGenLower] = useState<boolean>(true);
  const [genNumbers, setGenNumbers] = useState<boolean>(true);
  const [genSymbols, setGenSymbols] = useState<boolean>(true);

  useEffect(() => {
    const res = analyzePassword(password);
    setAnalysis(res);
  }, [password]);

  const handleGenerateNewKey = () => {
    const newKey = generatePassword({
      length: genLength,
      useUpper: genUpper,
      useLower: genLower,
      useNumbers: genNumbers,
      useSymbols: genSymbols,
    });
    setPassword(newKey);
    setShowPassword(true);
  };

  const handleLogAudit = () => {
    const scan: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'password',
      target: password.slice(0, 3) + '***' + password.slice(-2),
      riskScore: 100 - analysis.score,
      riskLevel:
        analysis.score >= 80 ? 'safe' : analysis.score >= 60 ? 'low' : analysis.score >= 40 ? 'suspicious' : 'dangerous',
      summary: `Password Strength Audit: ${analysis.strengthLabel} (${analysis.entropyBits} bits entropy)`,
      flags: analysis.feedback.map((fb) => ({
        title: 'Entropy Observation',
        description: fb,
        severity: analysis.score >= 60 ? 'safe' : 'suspicious',
      })),
      explanation: `Analyzed character distribution. Crack time estimated at ${analysis.crackTimeText} assuming 100 Billion guesses/sec.`,
      recommendations: analysis.suggestions,
    };
    storage.saveScan(scan);
    onScanCompleted(scan);
    alert('Password Audit logged to Security Records.');
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <KeyRound className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Entropy & Cryptographic Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            Password Strength & Key Generator
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Test password entropy bits, brute-force crack times, character set distribution, dictionary substitution vulnerabilities, and generate high-entropy security credentials.
          </p>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to evaluate..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-4 pr-24 py-3.5 text-slate-100 text-sm font-mono placeholder-slate-500 focus:outline-none transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-md"
                title="Copy Password"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogAudit}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs font-bold border border-slate-700/80 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Save Audit Log</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Score & Criteria Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metrics Overview */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-6 shadow-xl">
            {/* Score & Label Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Calculated Entropy Score</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl font-black font-mono text-slate-100">{analysis.score} / 100</span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase ${
                      analysis.score >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : analysis.score >= 60
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : analysis.score >= 40
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {analysis.strengthLabel}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Est. Brute Force Time
                </span>
                <p className="text-sm font-mono font-bold text-cyan-400 mt-0.5">{analysis.crackTimeText}</p>
              </div>
            </div>

            {/* Score Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Strength Scale</span>
                <span>{analysis.entropyBits} Bits Entropy</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.score >= 80
                      ? 'bg-emerald-500'
                      : analysis.score >= 60
                      ? 'bg-cyan-500'
                      : analysis.score >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, analysis.score)}%` }}
                />
              </div>
            </div>

            {/* Rules Checklist Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Length (12+)</span>
                <p className="text-sm font-mono font-bold text-slate-200 flex items-center justify-center gap-1">
                  {analysis.length >= 12 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  {analysis.length} Chars
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Uppercase (A-Z)</span>
                <p className="text-sm font-mono font-bold text-slate-200 flex items-center justify-center gap-1">
                  {analysis.hasUpper ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  {analysis.hasUpper ? 'Pass' : 'Missing'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Numbers (0-9)</span>
                <p className="text-sm font-mono font-bold text-slate-200 flex items-center justify-center gap-1">
                  {analysis.hasNumber ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  {analysis.hasNumber ? 'Pass' : 'Missing'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Symbols (!@#)</span>
                <p className="text-sm font-mono font-bold text-slate-200 flex items-center justify-center gap-1">
                  {analysis.hasSymbol ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  {analysis.hasSymbol ? 'Pass' : 'Missing'}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
              <h4 className="font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Security Optimization Feedback
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                {analysis.feedback.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Generator Settings */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-bold text-slate-100 text-base font-sans flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" /> Key Generator
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Random CS-PRNG</span>
            </div>

            {/* Slider Length */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Password Length:</span>
                <span className="text-emerald-400 font-bold">{genLength} Characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={genLength}
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-950 cursor-pointer"
              />
            </div>

            {/* Toggle options */}
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 cursor-pointer">
                <span>Uppercase Letters (A-Z)</span>
                <input
                  type="checkbox"
                  checked={genUpper}
                  onChange={(e) => setGenUpper(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 cursor-pointer">
                <span>Lowercase Letters (a-z)</span>
                <input
                  type="checkbox"
                  checked={genLower}
                  onChange={(e) => setGenLower(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 cursor-pointer">
                <span>Numbers (0-9)</span>
                <input
                  type="checkbox"
                  checked={genNumbers}
                  onChange={(e) => setGenNumbers(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 cursor-pointer">
                <span>Special Symbols (!@#$)</span>
                <input
                  type="checkbox"
                  checked={genSymbols}
                  onChange={(e) => setGenSymbols(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
              </label>
            </div>

            <button
              onClick={handleGenerateNewKey}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate High-Entropy Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
