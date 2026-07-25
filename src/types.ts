export type PageId =
  | 'dashboard'
  | 'assistant'
  | 'url-scanner'
  | 'email-analyzer'
  | 'password-analyzer'
  | 'learning-hub'
  | 'profile'
  | 'settings'
  | 'about';

export type RiskLevel = 'safe' | 'low' | 'suspicious' | 'dangerous' | 'critical';

export interface ThreatAlert {
  id: string;
  cveId?: string;
  title: string;
  category: 'Zero-Day' | 'Phishing' | 'Ransomware' | 'Malware' | 'Advisory' | 'Vulnerability';
  severity: RiskLevel;
  date: string;
  summary: string;
  affectedSystems: string[];
  recommendation: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  type: 'url' | 'email' | 'password';
  target: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  summary: string;
  threatType?: string;
  flags: {
    title: string;
    description: string;
    severity: RiskLevel;
  }[];
  explanation: string;
  recommendations: string[];
  technicalDetails?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeBlocks?: { language: string; code: string }[];
  isThinking?: boolean;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: 'Phishing' | 'Malware' | 'Ransomware' | 'Social Engineering' | 'Password Security' | 'Network Security' | 'Zero Trust' | 'OSINT';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTimeMinutes: number;
  iconName: string;
  summary: string;
  overview: string;
  keyTakeaways: string[];
  caseStudy: {
    title: string;
    scenario: string;
    resolution: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  securityScore: number;
  streakDays: number;
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
  scansCount: number;
  threatsBlocked: number;
  quizzesCompleted: number;
}

export interface AppSettings {
  theme: 'dark-navy' | 'cyberpunk' | 'deep-slate';
  notificationsEnabled: boolean;
  alertSeverityThreshold: RiskLevel;
  saveScanHistory: boolean;
  autoAnalyzeUrls: boolean;
  useGeminiApiKey: boolean;
}
