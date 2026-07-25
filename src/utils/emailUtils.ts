import { RiskLevel, ScanResult } from '../types';

export function heuristicAnalyzeEmail(emailContent: string): Partial<ScanResult> {
  const text = emailContent.toLowerCase();
  const flags: { title: string; description: string; severity: RiskLevel }[] = [];
  let score = 0;

  // Check 1: High urgency / coercion keywords
  const urgencyKeywords = [
    'immediate action required',
    'account suspended',
    'wire transfer',
    'gift card',
    'overdue invoice',
    'password reset requested',
    'unauthorized login detected',
    'urgent',
    'legal action',
    'terminate your account',
    'within 24 hours',
  ];
  const foundUrgency = urgencyKeywords.filter((k) => text.includes(k));
  if (foundUrgency.length > 0) {
    score += 30;
    flags.push({
      title: 'High Urgency & Coercive Phrasing',
      description: `Detected high-pressure psychological triggers: "${foundUrgency.join('", "')}".`,
      severity: 'suspicious',
    });
  }

  // Check 2: Financial or credential request
  const financialKeywords = ['bank account', 'credit card', 'ssn', 'social security', 'verify password', 'routing number', 'payment details', 'crypto payment', 'bitcoin'];
  const foundFinancial = financialKeywords.filter((k) => text.includes(k));
  if (foundFinancial.length > 0) {
    score += 35;
    flags.push({
      title: 'Sensitive Credential / Financial Solicitation',
      description: `Email solicits sensitive information: "${foundFinancial.join('", "')}".`,
      severity: 'dangerous',
    });
  }

  // Check 3: Mismatched URLs or suspicious links
  if (text.includes('click here') || text.includes('log in below') || text.includes('verify now')) {
    score += 15;
    flags.push({
      title: 'Generic Call-To-Action Link',
      description: 'Uses generic text prompts masking hyperlinked URLs.',
      severity: 'low',
    });
  }

  // Check 4: Executive impersonation / BEC
  const becKeywords = ['chief executive', 'ceo', 'payroll update', 'w-2', 'confidential transfer', 'direct deposit change'];
  if (becKeywords.some((k) => text.includes(k))) {
    score += 25;
    flags.push({
      title: 'Business Email Compromise (BEC) Pattern',
      description: 'Contains language characteristic of executive impersonation or payroll redirection scams.',
      severity: 'dangerous',
    });
  }

  // Check 5: Header anomaly heuristics
  if (text.includes('reply-to:') && text.includes('from:')) {
    const fromMatch = text.match(/from:\s*<([^>]+)>/i) || text.match(/from:\s*([^\s\n]+)/i);
    const replyMatch = text.match(/reply-to:\s*<([^>]+)>/i) || text.match(/reply-to:\s*([^\s\n]+)/i);
    if (fromMatch && replyMatch && fromMatch[1] !== replyMatch[1]) {
      score += 40;
      flags.push({
        title: 'Mismatched Reply-To Address (Header Spoofing)',
        description: `Sender "From" (${fromMatch[1]}) differs from "Reply-To" (${replyMatch[1]}).`,
        severity: 'critical',
      });
    }
  }

  const riskScore = Math.min(100, Math.max(0, score));
  let riskLevel: RiskLevel = 'safe';
  if (riskScore >= 75) riskLevel = 'dangerous';
  else if (riskScore >= 50) riskLevel = 'suspicious';
  else if (riskScore >= 25) riskLevel = 'low';

  if (flags.length === 0) {
    flags.push({
      title: 'No Immediate Phishing Patterns',
      description: 'Text does not match common automated phishing heuristics.',
      severity: 'safe',
    });
  }

  let threatType = 'Benign / Communication';
  if (score >= 60 && foundFinancial.length > 0) threatType = 'Credential Harvester / Phishing';
  else if (score >= 50 && becKeywords.some((k) => text.includes(k))) threatType = 'Business Email Compromise (BEC)';
  else if (score >= 40) threatType = 'Social Engineering Scam';

  return {
    target: emailContent.slice(0, 80) + '...',
    riskScore,
    riskLevel,
    threatType,
    flags,
    summary: riskScore > 50 ? 'High Risk Scam / Phishing Email' : 'Email Appears Low Risk',
    explanation: `Email content analyzed for psychological manipulation, credential solicitation, executive spoofing, and header anomalies.`,
    recommendations: riskScore > 50
      ? [
          'Do not click any hyperlinks contained within this email.',
          'Do not reply or send requested financial/credential data.',
          'Verify sender authenticity through an independent phone call or messaging channel.',
          'Report to your Security Operations Center (SOC).',
        ]
      : ['Exercise normal vigilance when following links to external sites.'],
  };
}
