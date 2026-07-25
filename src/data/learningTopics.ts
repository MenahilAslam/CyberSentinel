import { LearningTopic } from '../types';

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'phishing',
    title: 'Phishing & Spear Phishing Defense',
    category: 'Phishing',
    difficulty: 'Beginner',
    readTimeMinutes: 6,
    iconName: 'Fish',
    summary: 'Master identification of malicious emails, domain spoofing, and credentials harvesting tactics.',
    overview:
      'Phishing is the practice of sending fraudulent communications that appear to come from a reputable source, usually through email. The goal is to steal sensitive data like credit card numbers and login credentials, or to install malware on the victim machine.',
    keyTakeaways: [
      'Always inspect sender headers and verify Reply-To matches From.',
      'Hover over links before clicking to reveal the true underlying destination URL.',
      'Be wary of intense urgency, threat of account termination, or unusual requests.',
      'Utilize hardware security keys (FIDO2/WebAuthn) to render credential phishing ineffective.',
    ],
    caseStudy: {
      title: 'The Tech Giant OAuth Token Harvest (2024)',
      scenario:
        'Employees received emails appearing to come from their IT department asking them to re-authenticate their SSO credentials to maintain access to cloud tools.',
      resolution:
        'Organizations that deployed WebAuthn security keys mitigated 100% of the attacks, as FIDO2 keys bind authentication tokens specifically to legitimate domains.',
    },
    quiz: [
      {
        question: 'Which indicator strongly suggests an email is a phishing attempt?',
        options: [
          'It is sent during normal business hours.',
          'The sender email domain differs from the official company domain in the signature.',
          'It contains a standard unsubscribe link at the bottom.',
          'It includes a digital signature from a trusted internal authority.',
        ],
        correctIndex: 1,
        explanation: 'Domain discrepancies between display names, headers, and signatures are primary indicators of email spoofing.',
      },
      {
        question: 'Why are FIDO2/WebAuthn security keys superior against phishing compared to SMS OTP?',
        options: [
          'They change passwords automatically every hour.',
          'They cryptographically bind the login process to the exact origin domain, preventing relay attacks.',
          'They send SMS messages over encrypted satellite connections.',
          'They do not require user interaction.',
        ],
        correctIndex: 1,
        explanation: 'FIDO2 keys use origin-bound public key cryptography, meaning a phishing site cannot replay the token to the real site.',
      },
    ],
  },
  {
    id: 'ransomware',
    title: 'Ransomware Mechanics & Incident Response',
    category: 'Ransomware',
    difficulty: 'Intermediate',
    readTimeMinutes: 8,
    iconName: 'Skull',
    summary: 'Understand double-extortion tactics, lateral movement, volume shadow wiping, and mitigation.',
    overview:
      'Ransomware is malicious software designed to deny access to a computer system or data until a ransom is paid. Modern ransomware uses "Double Extortion"—encrypting system files AND exfiltrating confidential data to pressure victims.',
    keyTakeaways: [
      'Maintain immutable, air-gapped offline backups according to the 3-2-1 backup rule.',
      'Enforce least privilege and micro-segmentation to stop lateral movement across VLANs.',
      'Disable remote desktop protocol (RDP) on public internet facing IPs.',
      'Implement Endpoint Detection and Response (EDR) with automated behavioral isolation.',
    ],
    caseStudy: {
      title: 'Global Supply Chain Critical Infrastructure Halt',
      scenario:
        'A compromised VPN credential without MFA allowed threat actors to gain network persistence, disable shadow copies via vssadmin, and execute mass encryption.',
      resolution:
        'Rapid isolation of domain controllers and restoring from immutable cloud snapshots enabled recovery without paying ransom.',
    },
    quiz: [
      {
        question: 'What is "Double Extortion" in modern ransomware campaigns?',
        options: [
          'Charging the victim twice for the decryption key.',
          'Encrypting files AND exfiltrating sensitive data to threaten leak published on public web.',
          'Demanding ransom in both Bitcoin and Monero.',
          'Attacking both the primary company and its web host.',
        ],
        correctIndex: 1,
        explanation: 'Double extortion combines encryption with data exfiltration threats to maximize attacker leverage.',
      },
    ],
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering & Human Risk Management',
    category: 'Social Engineering',
    difficulty: 'Beginner',
    readTimeMinutes: 7,
    iconName: 'UserX',
    summary: 'Recognize baiting, pretexting, tailgating, vishing, and psychological manipulation triggers.',
    overview:
      'Social engineering relies on human interaction to trick people into breaking security procedures. Attackers exploit trust, authority, fear, and curiosity rather than software vulnerabilities.',
    keyTakeaways: [
      'Pretexting involves creating a fabricated scenario to manipulate a victim into providing information.',
      'Vishing (Voice Phishing) often uses AI voice cloning to impersonate executives or family members.',
      'Implement mandatory out-of-band verification for wire transfers or credential resets.',
    ],
    caseStudy: {
      title: 'Help Desk MFA Fatigue Attack',
      scenario:
        'Attacker called IT helpdesk pretending to be a remote VP who lost their phone, persuading tech support to reset the MFA token.',
      resolution:
        'Implemented strict video verification and manager sign-off protocols for all help desk identity resets.',
    },
    quiz: [
      {
        question: 'What is "Pretexting" in cybersecurity?',
        options: [
          'Writing code before running unit tests.',
          'Creating a invented scenario or backstory to persuade a target to reveal sensitive information.',
          'Sending encrypted SMS messages.',
          'Scanning network ports before launching an exploit.',
        ],
        correctIndex: 1,
        explanation: 'Pretexting establishes a false context of trust (e.g. pretending to be an IT admin or auditor).',
      },
    ],
  },
  {
    id: 'zero-trust',
    title: 'Zero Trust Architecture (ZTA)',
    category: 'Zero Trust',
    difficulty: 'Advanced',
    readTimeMinutes: 10,
    iconName: 'ShieldAlert',
    summary: 'Transition from legacy castle-and-moat network security to "Never Trust, Always Verify".',
    overview:
      'Zero Trust is a strategic cybersecurity model designed to prevent data breaches by eliminating implicit trust. It assumes that threats exist both outside and inside the network perimeter at all times.',
    keyTakeaways: [
      'Explicitly verify: Always authenticate and authorize based on all available data points.',
      'Use least-privileged access: Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA).',
      'Assume breach: Minimize blast radius by segmenting access by network, user, devices, and application awareness.',
    ],
    caseStudy: {
      title: 'Enterprise Perimeter Breach Containment',
      scenario:
        'An attacker compromised a developer workstation via a malicious NPM package dependency.',
      resolution:
        'Because the network used Zero Trust microsegmentation, the compromised machine could not access production database clusters or internal code repos.',
    },
    quiz: [
      {
        question: 'Which principle is fundamental to Zero Trust Architecture?',
        options: [
          'Trust all traffic originating inside the corporate firewall.',
          'Never trust, always verify every access request regardless of origin.',
          'Use long-lived passwords with no MFA for internal servers.',
          'Store all corporate encryption keys on public web servers.',
        ],
        correctIndex: 1,
        explanation: 'Zero Trust eliminates implicit trust based on network location or device ownership.',
      },
    ],
  },
  {
    id: 'password-security',
    title: 'Password Security & Identity Hygiene',
    category: 'Password Security',
    difficulty: 'Beginner',
    readTimeMinutes: 5,
    iconName: 'KeyRound',
    summary: 'Understand password entropy, dictionary attacks, passkeys, and hashing algorithms.',
    overview:
      'Passwords remain a primary credential vector. Attackers use credential stuffing, rainbow tables, and GPU-accelerated hash cracking to compromise weak or reused credentials.',
    keyTakeaways: [
      'Entropy matters more than artificial complexity rules: longer passphrases beat short complex strings.',
      'Never reuse passwords across multiple personal or work services.',
      'Use zero-knowledge encrypted password managers (1Password, Bitwarden).',
      'Understand password hashing: Argon2id and bcrypt resist GPU cracking far better than MD5 or SHA1.',
    ],
    caseStudy: {
      title: 'Credential Stuffing Botnet Breaches 500k Accounts',
      scenario:
        'Attackers used a breach database from an old e-commerce site to test credentials on financial web portals.',
      resolution:
        'Users who used unique passwords or enabled MFA remained completely safe.',
    },
    quiz: [
      {
        question: 'What factor contributes most significantly to password entropy and cracking resistance?',
        options: [
          'Changing the password every 7 days.',
          'Increasing total character length using random words (passphrases).',
          'Using the word "Admin" with an exclamation point.',
          'Storing the password in an unencrypted text file.',
        ],
        correctIndex: 1,
        explanation: 'Length increases search space exponentially (E = L * log2(R)), making long passphrases computationally prohibitive to crack.',
      },
    ],
  },
  {
    id: 'osint',
    title: 'OSINT (Open Source Intelligence) & Digital Footprint',
    category: 'OSINT',
    difficulty: 'Intermediate',
    readTimeMinutes: 9,
    iconName: 'Search',
    summary: 'Learn how threat actors conduct reconnaissance using publicly accessible web data.',
    overview:
      'Open Source Intelligence (OSINT) involves collecting and analyzing data gathered from open, publicly available sources to produce actionable intelligence for defense or attack surface mapping.',
    keyTakeaways: [
      'Threat actors map organization structures via LinkedIn, Github leaks, and WHOIS domain records.',
      'Metadata in public PDFs and images can expose internal software versions and username formats.',
      'Regularly audit public corporate repositories for hardcoded API keys and credentials.',
    ],
    caseStudy: {
      title: 'API Secret Exposure in Public Code Repository',
      scenario:
        'A junior developer pushed a test script containing AWS access keys to a personal public GitHub repository.',
      resolution:
        'Automated OSINT scanners detected the key within 3 minutes and automatically revoked access before exploit.',
    },
    quiz: [
      {
        question: 'What is OSINT in cybersecurity practice?',
        options: [
          'Operating System Internal Network Technology.',
          'Intelligence gathered from publicly available, open-source data.',
          'An offensive zero-day exploit framework.',
          'An offline hardware firewall device.',
        ],
        correctIndex: 1,
        explanation: 'OSINT utilizes public web data, search engine dorks, domain records, and social media to assess threat exposure.',
      },
    ],
  },
];
