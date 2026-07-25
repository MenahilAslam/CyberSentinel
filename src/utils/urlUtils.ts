import { RiskLevel, ScanResult } from '../types';

export function heuristicAnalyzeUrl(urlInput: string): Partial<ScanResult> {
  let cleanUrl = urlInput.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  let hostname = '';
  let protocol = 'https:';
  try {
    const parsed = new URL(cleanUrl);
    hostname = parsed.hostname;
    protocol = parsed.protocol;
  } catch {
    hostname = cleanUrl;
  }

  const flags: { title: string; description: string; severity: RiskLevel }[] = [];
  let score = 0;

  // Check 1: Protocol
  if (protocol === 'http:') {
    score += 25;
    flags.push({
      title: 'Insecure Protocol (HTTP)',
      description: 'The website uses unencrypted HTTP traffic susceptible to Man-In-The-Middle attacks.',
      severity: 'suspicious',
    });
  }

  // Check 2: Raw IP address hostname
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    score += 35;
    flags.push({
      title: 'Raw IP Address Hostname',
      description: 'Legitimate services use domain names. IP-based URLs often bypass domain reputation filters.',
      severity: 'dangerous',
    });
  }

  // Check 3: Suspicious TLD
  const suspiciousTLDs = ['.xyz', '.top', '.work', '.click', '.gq', '.tk', '.ml', '.ga', '.cf', '.cc', '.zip', '.mov'];
  const hasSuspiciousTLD = suspiciousTLDs.some((tld) => hostname.endsWith(tld));
  if (hasSuspiciousTLD) {
    score += 20;
    flags.push({
      title: 'High-Risk Top-Level Domain (TLD)',
      description: 'The TLD used has a statistically higher incidence of phishing campaigns.',
      severity: 'suspicious',
    });
  }

  // Check 4: Typosquatting / Brand Spoofing keywords
  const brandKeywords = ['paypal', 'bank', 'login', 'verify', 'account', 'security', 'apple', 'google', 'microsoft', 'amazon', 'netflix', 'wallet', 'crypto', 'auth', 'signin'];
  const foundBrands = brandKeywords.filter((kw) => hostname.toLowerCase().includes(kw));
  if (foundBrands.length > 0) {
    const trustedDomains = ['paypal.com', 'bankofamerica.com', 'apple.com', 'google.com', 'microsoft.com', 'amazon.com', 'netflix.com'];
    const isTrusted = trustedDomains.some((td) => hostname === td || hostname.endsWith('.' + td));
    if (!isTrusted) {
      score += 40;
      flags.push({
        title: 'Brand Impersonation / Typosquatting Indicator',
        description: `Contains brand keywords (${foundBrands.join(', ')}) on an unverified domain name.`,
        severity: 'dangerous',
      });
    }
  }

  // Check 5: Excessive subdomains / Hyphens
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 15;
    flags.push({
      title: 'Excessive Domain Hyphenation',
      description: 'Multiple hyphens are commonly used to create confusing spoofed domain names.',
      severity: 'suspicious',
    });
  }

  const subdomains = hostname.split('.');
  if (subdomains.length > 4) {
    score += 20;
    flags.push({
      title: 'Deeply Nested Subdomains',
      description: 'Unusually long subdomain hierarchy designed to obscure the actual root domain.',
      severity: 'suspicious',
    });
  }

  // Check 6: URL shortener
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly', 'rb.gy'];
  if (shorteners.some((s) => hostname.includes(s))) {
    score += 15;
    flags.push({
      title: 'URL Shortener Detected',
      description: 'The destination URL is masked behind a redirection shortener service.',
      severity: 'low',
    });
  }

  const riskScore = Math.min(100, Math.max(0, score));
  let riskLevel: RiskLevel = 'safe';
  if (riskScore >= 75) riskLevel = 'dangerous';
  else if (riskScore >= 50) riskLevel = 'suspicious';
  else if (riskScore >= 25) riskLevel = 'low';

  if (flags.length === 0) {
    flags.push({
      title: 'Standard Domain Structure',
      description: 'No obvious heuristic anomalies detected in URL syntax or protocol.',
      severity: 'safe',
    });
  }

  return {
    target: urlInput,
    riskScore,
    riskLevel,
    flags,
    summary: riskScore > 50 ? 'Potential Phishing URL Detected' : 'URL Appears Generally Safe',
    explanation: `Domain ${hostname} evaluated for protocol integrity, domain trickery, brand keywords, and structural anomalies.`,
    recommendations: riskScore > 50
      ? ['Do not enter credentials or sensitive personal information.', 'Avoid downloading files from this domain.', 'Report domain to internal SecOps team.']
      : ['Verify HTTPS certificate lock icon in your browser.', 'Ensure you intended to visit this specific domain.'],
  };
}
