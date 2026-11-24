const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijkmnopqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%^&*-_=+?';
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;

function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Cryptographically secure random generator is unavailable.');
  }
  const maxValid = Math.floor(0xffffffff / maxExclusive) * maxExclusive;
  const buffer = new Uint32Array(1);
  let value = 0;
  do {
    cryptoObj.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= maxValid);
  return value % maxExclusive;
}

/**
 * Generates a strong random password using Web Crypto API (`crypto.getRandomValues`).
 * Guarantees at least one character from uppercase, lowercase, digits, and symbols.
 */
export function generateSecurePassword(length = 16): string {
  const safeLength = Math.max(12, Math.min(64, length));
  const chars: string[] = [
    UPPERCASE[secureRandomInt(UPPERCASE.length)],
    LOWERCASE[secureRandomInt(LOWERCASE.length)],
    DIGITS[secureRandomInt(DIGITS.length)],
    SYMBOLS[secureRandomInt(SYMBOLS.length)],
  ];

  for (let i = chars.length; i < safeLength; i++) {
    chars.push(ALL_CHARS[secureRandomInt(ALL_CHARS.length)]);
  }

  // Fisher-Yates shuffle using CSPRNG
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }

  return chars.join('');
}

/**
 * Generates an expiring uppercase alphanumeric connection code for Telegram linking.
 */
export function generateConnectionCode(prefix = 'OXV'): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let partA = '';
  let partB = '';
  for (let i = 0; i < 4; i++) {
    partA += alphabet[secureRandomInt(alphabet.length)];
    partB += alphabet[secureRandomInt(alphabet.length)];
  }
  return `${prefix}-${partA}-${partB}`;
}

/**
 * Masks sensitive API credentials for display without exposing secrets.
 */
export function maskCredential(value: string, visibleStart = 4, visibleEnd = 4): string {
  const trimmed = value.trim();
  if (!trimmed) return '••••••••••••';
  if (trimmed.length <= visibleStart + visibleEnd) {
    return '•'.repeat(Math.max(8, trimmed.length));
  }
  return `${trimmed.slice(0, visibleStart)}••••••••${trimmed.slice(-visibleEnd)}`;
}

export interface PasswordStrength {
  score: 1 | 2 | 3 | 4;
  label: 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  let checks = 0;
  if (password.length >= 12) checks++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) checks++;
  if (/\d/.test(password)) checks++;
  if (/[^A-Za-z0-9]/.test(password)) checks++;

  if (checks >= 4 && password.length >= 14) return { score: 4, label: 'Very Strong' };
  if (checks >= 3) return { score: 3, label: 'Strong' };
  if (checks >= 2) return { score: 2, label: 'Fair' };
  return { score: 1, label: 'Weak' };
}

export function sanitizeCsvCell(value: string | number | undefined): string {
  const str = value === undefined ? '' : String(value);
  // Prevent CSV formula injection
  const neutralized = /^[=+\-@]/.test(str) ? `'${str}` : str;
  const escaped = neutralized.replace(/"/g, '""');
  return `"${escaped}"`;
}
