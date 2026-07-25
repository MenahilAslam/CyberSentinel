import React, { useState } from 'react';
import { ScanResult } from '../types';
import { heuristicAnalyzeEmail } from '../utils/emailUtils';
import { storage } from '../utils/storage';
import { RiskBadge } from '../components/RiskBadge';
import { RiskScoreGauge } from '../components/RiskScoreGauge';
import {
  MailWarning,
  ShieldAlert,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  FileText,
  Copy,
} from 'lucide-react';

interface EmailAnalyzerPageProps {
  onScanCompleted: (result: ScanResult) => void;
}

export const EmailAnalyzerPage: React.FC<EmailAnalyzerPageProps> = ({ onScanCompleted }) => {
  const [emailText, setEmailText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);

  const sampleEmails = [
    {
      label: 'Executive Wire Transfer BEC',
      content:
        'From: CEO John Smith <john.smith@corp-executive.com>\nReply-To: ceo.smith99@gmail.com\nSubject: URGENT: Confidential Wire Transfer Needed Today\n\nHi Alex,\nI am currently in an urgent board meeting and unable to take calls. Please execute a wire transfer of $45,000 to our vendor immediately to prevent account termination. Details attached. Reply directly to this email when complete.',
    },
    {
      label: 'Fake Invoice Phishing',
      content:
        'From: Billing Support <no-reply@invoicing-gateway.xyz>\nSubject: OVERDUE: Invoice #INV-92041 Action Required\n\nYour recent subscription invoice of $899.00 is overdue. If payment is not processed within 24 hours, your account access will be permanently revoked. Click here to verify your payment credentials: http://login.invoicing-gateway.xyz/verify',
    },
    {
      label: 'Legitimate Newsletter',
      content:
        'From: Security Weekly <newsletter@securityweekly.com>\nSubject: Issue #412: Zero Trust Best Practices & Patch Updates\n\nWelcome to this week’s newsletter! Highlights include new WebAuthn standards, Linux kernel patch releases, and upcoming SecOps webinars.',
    },
  ];

  const handleExecuteAnalysis = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || emailText).trim();
    if (!text || isAnalyzing) return;

    setIsAnalyzing(true);
    setCurrentResult(null);

    try {
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText: text }),
      });

      let aiResult = await response.json();

      if (aiResult.isDemo || aiResult.error || !aiResult.riskScore) {
        const localPartial = heuristicAnalyzeEmail(text);
        aiResult = {
          id: `scan-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'email',
          target: text.slice(0, 80) + '...',
          riskScore: localPartial.riskScore || 50,
          riskLevel: localPartial.riskLevel || 'suspicious',
          threatType: localPartial.threatType || 'Social Engineering Scam',
          summary: localPartial.summary || 'Email Analysis Result',
          flags: localPartial.flags || [],
          explanation: localPartial.explanation || 'Evaluated via email heuristic rules.',
          recommendations: localPartial.recommendations || ['Verify sender credentials out-of-band.'],
        };
      } else {
        aiResult.id = `scan-${Date.now()}`;
        aiResult.timestamp = new Date().toISOString();
        aiResult.type = 'email';
        aiResult.target = text.slice(0, 80) + '...';
      }

      setCurrentResult(aiResult);
      storage.saveScan(aiResult);
      onScanCompleted(aiResult);
    } catch (err) {
      console.error('Email analysis error:', err);
      const localPartial = heuristicAnalyzeEmail(text);
      const fallbackResult: ScanResult = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'email',
        target: text.slice(0, 80) + '...',
        riskScore: localPartial.riskScore || 50,
        riskLevel: localPartial.riskLevel || 'suspicious',
        threatType: localPartial.threatType || 'Social Engineering Scam',
        summary: localPartial.summary || 'Email Evaluation Result',
        flags: localPartial.flags || [],
        explanation: localPartial.explanation || 'Evaluated via heuristic email filters.',
        recommendations: localPartial.recommendations || ['Exercise caution before following links.'],
      };
      setCurrentResult(fallbackResult);
      storage.saveScan(fallbackResult);
      onScanCompleted(fallbackResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MailWarning className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Email Phishing & BEC Analyzer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            Scam Email & Spoofing Detector
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Paste suspicious email body content or raw headers. Gemini AI will evaluate coercive urgency, Business Email Compromise (BEC) patterns, header spoofing, credential harvesting lures, and malware distribution indicators.
          </p>
        </div>

        {/* Textarea Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteAnalysis();
          }}
          className="mt-6 space-y-3"
        >
          <div className="relative">
            <textarea
              rows={6}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste email text or headers here... e.g. From: CEO <john@corp.com> ... Subject: Urgent Wire Transfer Required"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-slate-100 text-sm font-mono placeholder-slate-500 focus:outline-none transition-colors custom-scrollbar"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Sample presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 custom-scrollbar">
              <span className="font-mono text-slate-400 text-xs shrink-0">Sample Templates:</span>
              {sampleEmails.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setEmailText(sample.content);
                    handleExecuteAnalysis(sample.content);
                  }}
                  disabled={isAnalyzing}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-slate-700 whitespace-nowrap transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!emailText.trim() || isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analyzing Email Vectors...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center space-y-4">
          <Sparkles className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-100 text-base">Analyzing Social Engineering Tactics</h3>
            <p className="text-xs text-slate-400 font-mono">
              Checking header reply-to integrity, credential harvesting lures, and executive spoofing...
            </p>
          </div>
        </div>
      )}

      {/* Results Card */}
      {currentResult && !isAnalyzing && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 space-y-6 shadow-xl animate-fadeIn">
          {/* Header Verdict */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-5">
              <RiskScoreGauge score={currentResult.riskScore} riskLevel={currentResult.riskLevel} size={110} />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <RiskBadge level={currentResult.riskLevel} size="lg" />
                  {currentResult.threatType && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentResult.threatType}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-100 font-sans">{currentResult.summary}</h2>
                <p className="text-xs text-slate-400 font-mono">
                  Analyzed at {new Date(currentResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> AI Threat Assessment Breakdown
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{currentResult.explanation}</p>
          </div>

          {/* Grid: Risk Flags + Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Detected Red Flags
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

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 font-sans flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-cyan-400" /> Recommended Safeguards
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
