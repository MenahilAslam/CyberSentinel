import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { storage } from '../utils/storage';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Shield,
  Code2,
  Terminal,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getChatMessages());
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    'How do I investigate a suspicious IP address or domain?',
    'Explain Zero Trust Architecture and its core pillars.',
    'What are the key steps for Incident Response during a Ransomware outbreak?',
    'How do I secure an Express / Node.js web application against SQL Injection?',
    'What is the difference between OAuth 2.0 and SAML 2.0?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getFallbackCyberResponse = (prompt: string): string => {
    const lower = prompt.toLowerCase();

    if (lower.includes('zero trust')) {
      return `### CyberSentinel Security Intelligence: Zero Trust Architecture

**Zero Trust** is a strategic cybersecurity framework based on the strict principle: *"Never Trust, Always Verify."* It assumes that threats exist both outside and inside the network perimeter.

#### 5 Core Pillars of Zero Trust:
1. **Identity & Access Management (IAM):** Enforce strict Multi-Factor Authentication (MFA), passwordless credentials, and continuous identity verification.
2. **Least Privilege Access (PoLP):** Grant users and applications only the minimum necessary access required for their role (Role-Based Access Control).
3. **Microsegmentation:** Divide network infrastructure into isolated zones to prevent lateral movement of attackers during a breach.
4. **Continuous Monitoring & Telemetry:** Collect and analyze logs across endpoints, firewalls, and SIEM platforms in real time.
5. **Data Protection & Encryption:** Encrypt sensitive data both at rest (AES-256) and in transit (TLS 1.3).

> **Implementation Priority:** Begin by mapping sensitive data assets, auditing active user permissions, and enforcing mandatory MFA across all administrative access points.`;
    }

    if (lower.includes('ransomware') || lower.includes('incident response') || lower.includes('outbreak')) {
      return `### CyberSentinel Incident Response Framework: Ransomware Outbreak

When facing an active Ransomware outbreak, execution speed and containment are critical. Follow this structured 4-phase Incident Response (IR) protocol:

#### Phase 1: Immediate Containment (Minutes 0–15)
- **Isolate Systems:** Immediately disconnect affected endpoints and servers from the network (disable Wi-Fi and pull Ethernet cords).
- **Disable Compromised Accounts:** Suspend directory sync and active tokens for compromised user credentials.
- **Preserve Memory:** Do NOT reboot infected hosts immediately; dump volatile RAM if forensic tools are available.

#### Phase 2: Eradication & Investigation
- **Identify Malware Family:** Examine file extensions, ransom notes, and C2 IP addresses.
- **Audit Backups:** Verify backup integrity and ensure offline/immutable snapshots were not corrupted or wiped.

#### Phase 3: Recovery & System Restoration
- **Rebuild Hosts:** Re-image affected workstations from trusted, verified clean gold images.
- **Patch Zero-Days:** Remediate the initial access vector (e.g., exposed RDP, unpatched VPN, or phishing link).

#### Phase 4: Lessons Learned
- Update EDR rule signatures, conduct post-incident audits, and strengthen security awareness training.`;
    }

    if (lower.includes('phishing') || lower.includes('email') || lower.includes('bec')) {
      return `### CyberSentinel Anti-Phishing & Email Security Protocol

#### Key Indicators of Phishing & BEC Attacks:
1. **Display Name & Domain Spoofing:** Mismatched \`From\` header vs. actual sending domain (e.g. \`support@paypa1-security.com\`).
2. **Psychological Urgency:** Threats of account suspension, urgent wire transfer requests, or fake unpaid invoice alerts.
3. **Credential Harvesters:** Shortened or obfuscated links directing users to counterfeit OAuth or login portals.

#### Immediate Mitigation Steps:
- Do not click links or open attachments.
- Report the email headers to your Security Operations Center (SOC).
- Enforce SPF, DKIM, and DMARC (\`p=reject\`) policies across your DNS domain.`;
    }

    return `### CyberSentinel Security Intelligence Briefing

**Query Analyzed:** "${prompt}"

#### Core SecOps Security Baseline:
1. **Defense-in-Depth:** Combine multi-layer security controls including Web Application Firewalls (WAF), Endpoint Detection & Response (EDR), and Network Intrusion Prevention.
2. **Access Control:** Enforce strict Least Privilege Access (PoLP) and Multi-Factor Authentication (MFA).
3. **Vulnerability Management:** Perform automated dependency scanning (e.g., Dependabot, Snyk) and apply vendor security patches promptly.
4. **Log Audit & Monitoring:** Maintain centralized logging (SIEM) with real-time alerting for anomalous traffic or unexpected privilege escalation.

*CyberSentinel AI has provided this SecOps baseline guidance. Ensure \`GEMINI_API_KEY\` is active in Vercel project settings for live AI analysis.*`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    storage.saveChatMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    // Set up AbortController timeout to guarantee request finishes within 25 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map((m) => ({ sender: m.sender, content: m.content })),
        }),
      });

      clearTimeout(timeoutId);

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const replyText =
        data.reply ||
        data.error ||
        getFallbackCyberResponse(text);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      storage.saveChatMessages(finalMessages);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Chat error:', err);

      const fallbackContent = getFallbackCyberResponse(text);

      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      storage.saveChatMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const initMsg: ChatMessage[] = [
      {
        id: 'init-msg',
        sender: 'assistant',
        content:
          "Chat history cleared. I am **CyberSentinel AI**. Ask me any cybersecurity question, code security review, or incident response query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(initMsg);
    storage.saveChatMessages(initMsg);
    setInputMessage('');
    setIsLoading(false);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl animate-fadeIn">
      {/* Top Assistant Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-100 text-base font-sans">Gemini 3.6 Security Assistant</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">SecOps AI Reasoning & Cyber Threat Analysis</p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs font-mono border border-slate-700/60 transition-colors flex items-center gap-1.5"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md mt-1">
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}

              <div
                className={`relative group rounded-2xl p-4 text-sm leading-relaxed space-y-2 max-w-2xl ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs shadow-lg'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-bl-xs shadow-md'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-4 text-[11px] font-mono opacity-80 pb-1 border-b border-white/10">
                  <span className="font-bold">{isUser ? 'You' : 'CyberSentinel Gemini AI'}</span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-white"
                      title="Copy Message"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap font-sans text-slate-100 text-sm">{msg.content}</div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center shrink-0 mt-1 font-mono font-bold text-xs">
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-md items-center text-slate-400 font-mono text-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800/90 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-2 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Gemini AI is analyzing security threat vectors...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto flex gap-2 custom-scrollbar shrink-0">
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0 py-1">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Starter Prompts:
        </span>
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 text-xs font-sans text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-cyan-300 border border-slate-800 rounded-full whitespace-nowrap transition-colors disabled:opacity-50 shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Gemini AI about security threats, incident response, code bugs, or CVE vulnerabilities..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
