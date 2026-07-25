export interface PasswordAnalysis {
  score: number; // 0 - 100
  entropyBits: number;
  length: number;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  crackTimeText: string;
  strengthLabel: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' | 'Invincible';
  feedback: string[];
  suggestions: string[];
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      entropyBits: 0,
      length: 0,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSymbol: false,
      crackTimeText: 'Instant',
      strengthLabel: 'Very Weak',
      feedback: ['Password cannot be empty.'],
      suggestions: ['Enter a password of at least 12 characters.'],
    };
  }

  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 33;

  // Calculate Entropy: E = L * log2(R)
  const entropyBits = Math.floor(length * (poolSize > 0 ? Math.log2(poolSize) : 0));

  // Common pattern penalties
  let penalty = 0;
  const commonPatterns = ['12345', 'password', 'qwerty', 'admin', 'welcome', 'letmein', 'iloveyou', 'p@ssword'];
  for (const pat of commonPatterns) {
    if (password.toLowerCase().includes(pat)) {
      penalty += 35;
    }
  }

  // Repeating character penalty
  if (/(.)\1{2,}/.test(password)) {
    penalty += 15;
  }

  // Calculate score (0-100)
  let score = Math.min(100, Math.max(0, Math.round((entropyBits / 80) * 100) - penalty));

  let strengthLabel: PasswordAnalysis['strengthLabel'] = 'Very Weak';
  if (score >= 90) strengthLabel = 'Invincible';
  else if (score >= 75) strengthLabel = 'Very Strong';
  else if (score >= 60) strengthLabel = 'Strong';
  else if (score >= 40) strengthLabel = 'Moderate';
  else if (score >= 20) strengthLabel = 'Weak';

  // Estimate crack time assuming 100 billion guesses/sec
  const combinations = Math.pow(poolSize || 1, length);
  const guessesPerSec = 100_000_000_000; // 100 Billion/s
  const secondsToCrack = combinations / guessesPerSec;

  let crackTimeText = 'Instant';
  if (secondsToCrack > 31536000 * 1_000_000_000) crackTimeText = 'Trillions of years';
  else if (secondsToCrack > 31536000 * 1_000_000) crackTimeText = 'Millions of years';
  else if (secondsToCrack > 31536000 * 1000) crackTimeText = 'Thousands of years';
  else if (secondsToCrack > 31536000) crackTimeText = `${Math.floor(secondsToCrack / 31536000)} years`;
  else if (secondsToCrack > 86400 * 30) crackTimeText = `${Math.floor(secondsToCrack / (86400 * 30))} months`;
  else if (secondsToCrack > 86400) crackTimeText = `${Math.floor(secondsToCrack / 86400)} days`;
  else if (secondsToCrack > 3600) crackTimeText = `${Math.floor(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack > 60) crackTimeText = `${Math.floor(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack > 1) crackTimeText = `${Math.floor(secondsToCrack)} seconds`;

  const feedback: string[] = [];
  const suggestions: string[] = [];

  if (length < 12) {
    feedback.push('Password length is under 12 characters.');
    suggestions.push('Increase length to 14+ characters using passphrases.');
  }
  if (!hasUpper || !hasLower) {
    feedback.push('Lacks mixed letter casing.');
    suggestions.push('Combine both uppercase and lowercase letters.');
  }
  if (!hasNumber) {
    feedback.push('Contains no numbers.');
    suggestions.push('Add random digits within words, not just at the end.');
  }
  if (!hasSymbol) {
    feedback.push('Contains no special symbols.');
    suggestions.push('Include symbols like !@#$%^&*()_+-=');
  }
  if (penalty > 0) {
    feedback.push('Uses predictable dictionary words or sequential characters.');
    suggestions.push('Avoid common words, sequential numbers (1234), or keyboard rows (qwerty).');
  }

  if (feedback.length === 0) {
    feedback.push('Excellent complexity and high entropy.');
  }

  return {
    score,
    entropyBits,
    length,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    crackTimeText,
    strengthLabel,
    feedback,
    suggestions,
  };
}

export function generatePassword(options: {
  length?: number;
  useUpper?: boolean;
  useLower?: boolean;
  useNumbers?: boolean;
  useSymbols?: boolean;
}): string {
  const {
    length = 16,
    useUpper = true,
    useLower = true,
    useNumbers = true,
    useSymbols = true,
  } = options;

  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charSet = '';
  const mandatoryChars: string[] = [];

  if (useUpper) {
    charSet += upper;
    mandatoryChars.push(upper[Math.floor(Math.random() * upper.length)]);
  }
  if (useLower) {
    charSet += lower;
    mandatoryChars.push(lower[Math.floor(Math.random() * lower.length)]);
  }
  if (useNumbers) {
    charSet += numbers;
    mandatoryChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (useSymbols) {
    charSet += symbols;
    mandatoryChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  if (!charSet) {
    charSet = lower + numbers;
  }

  const result: string[] = [...mandatoryChars];
  for (let i = mandatoryChars.length; i < length; i++) {
    result.push(charSet[Math.floor(Math.random() * charSet.length)]);
  }

  // Shuffle array securely
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}
