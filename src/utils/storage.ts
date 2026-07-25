import { AppSettings, ChatMessage, ScanResult, UserProfile } from '../types';

const STORAGE_KEYS = {
  SCANS: 'cybersentinel_scans_v1',
  CHAT: 'cybersentinel_chat_v1',
  SETTINGS: 'cybersentinel_settings_v1',
  PROFILE: 'cybersentinel_profile_v1',
  BOOKMARKS: 'cybersentinel_bookmarks_v1',
  QUIZ_PROGRESS: 'cybersentinel_quiz_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark-navy',
  notificationsEnabled: true,
  alertSeverityThreshold: 'suspicious',
  saveScanHistory: true,
  autoAnalyzeUrls: true,
  useGeminiApiKey: true,
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Vance',
  email: 'a.vance@secops.corp',
  role: 'Senior Cyber Threat Analyst',
  organization: 'Aegis Defense Labs',
  securityScore: 88,
  streakDays: 14,
  scansCount: 42,
  threatsBlocked: 19,
  quizzesCompleted: 6,
  badges: [
    {
      id: 'b1',
      title: 'Phishing Sentinel',
      description: 'Identified and blocked 10+ malicious phishing URLs.',
      icon: 'ShieldCheck',
      unlockedAt: '2026-06-15',
    },
    {
      id: 'b2',
      title: 'Password Guardian',
      description: 'Audited enterprise passwords with high entropy standards.',
      icon: 'Key',
      unlockedAt: '2026-07-02',
    },
    {
      id: 'b3',
      title: 'Zero Trust Scholar',
      description: 'Completed all Zero Trust & Network Security learning modules.',
      icon: 'Award',
      unlockedAt: '2026-07-20',
    },
  ],
};

const SAMPLE_SCANS: ScanResult[] = [
  {
    id: 'scan-101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'url',
    target: 'http://login.paypal-account-security-update.xyz/verify',
    riskScore: 92,
    riskLevel: 'dangerous',
    threatType: 'Credential Harvester',
    summary: 'Critical Phishing URL Impersonating PayPal',
    flags: [
      {
        title: 'Brand Impersonation',
        description: 'Target URL uses paypal keyword on unauthorized domain (.xyz)',
        severity: 'dangerous',
      },
      {
        title: 'Insecure Protocol',
        description: 'HTTP connection without valid SSL/TLS encryption',
        severity: 'suspicious',
      },
      {
        title: 'High Risk TLD',
        description: '.xyz domain frequently associated with automated botnets',
        severity: 'suspicious',
      },
    ],
    explanation: 'High confidence malicious URL designed to capture PayPal authentication tokens.',
    recommendations: ['Block domain in web gateway', 'Alert targeted user', 'Purge related emails'],
  },
  {
    id: 'scan-102',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    type: 'email',
    target: 'URGENT: Executive Wire Transfer Request - Confidential',
    riskScore: 84,
    riskLevel: 'dangerous',
    threatType: 'Business Email Compromise (BEC)',
    summary: 'Executive Spoofing & Urgent Financial Request',
    flags: [
      {
        title: 'Reply-To Mismatch',
        description: 'From address displays CEO name but Reply-To points to webmail',
        severity: 'critical',
      },
      {
        title: 'Coercive Urgency',
        description: 'Demands immediate wire transfer bypassing standard approval checks',
        severity: 'suspicious',
      },
    ],
    explanation: 'Scam email exhibiting classic Business Email Compromise tactics.',
    recommendations: ['Do not execute wire transfer', 'Contact executive via phone', 'Report to IT Security'],
  },
  {
    id: 'scan-103',
    timestamp: new Date(Date.now() - 3600000 * 32).toISOString(),
    type: 'password',
    target: 'Cyb3r#Guard!2026',
    riskScore: 15,
    riskLevel: 'safe',
    summary: 'Strong Enterprise Password',
    flags: [
      {
        title: 'High Entropy',
        description: 'Contains 84+ bits of entropy with upper, lower, digits, and symbols',
        severity: 'safe',
      },
    ],
    explanation: 'Password exceeds minimum standard security complexity.',
    recommendations: ['Store in encrypted password manager', 'Do not reuse across accounts'],
  },
];

export const storage = {
  getScans(): ScanResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCANS);
      return data ? JSON.parse(data) : SAMPLE_SCANS;
    } catch {
      return SAMPLE_SCANS;
    }
  },

  saveScan(scan: ScanResult): ScanResult[] {
    const current = this.getScans();
    const updated = [scan, ...current.filter((s) => s.id !== scan.id)];
    try {
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    // Update profile count
    const profile = this.getProfile();
    profile.scansCount += 1;
    if (scan.riskScore > 50) profile.threatsBlocked += 1;
    this.saveProfile(profile);
    return updated;
  },

  clearScans(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SCANS);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      return data
        ? JSON.parse(data)
        : [
            {
              id: 'init-msg',
              sender: 'assistant',
              content:
                "Hello! I am **CyberSentinel AI**, your cybersecurity intelligence assistant. You can ask me about incident response, threat hunting, vulnerability assessment, zero-trust architecture, or analyzing specific technical artifacts. How can I assist your SecOps team today?",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ];
    } catch {
      return [];
    }
  },

  saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getQuizProgress(): Record<string, number> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveQuizScore(topicId: string, score: number): void {
    const current = this.getQuizProgress();
    current[topicId] = Math.max(current[topicId] || 0, score);
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(current));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const profile = this.getProfile();
    profile.quizzesCompleted = Object.keys(current).length;
    this.saveProfile(profile);
  },
};
