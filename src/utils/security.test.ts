import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluatePasswordStrength,
  generateConnectionCode,
  generateSecurePassword,
  maskCredential,
  sanitizeCsvCell,
} from './security';

test('generateSecurePassword creates strong password with required character classes', () => {
  const pwd = generateSecurePassword(18);
  assert.equal(pwd.length, 18);
  assert.match(pwd, /[A-Z]/);
  assert.match(pwd, /[a-z]/);
  assert.match(pwd, /\d/);
  assert.match(pwd, /[!@#$%^&*\-_=+?]/);
});

test('generateSecurePassword enforces minimum safe length of 12', () => {
  const pwd = generateSecurePassword(4);
  assert.equal(pwd.length, 12);
});

test('generateConnectionCode formats expiring Telegram link code properly', () => {
  const code = generateConnectionCode('OXV');
  assert.match(code, /^OXV-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
});

test('maskCredential hides middle characters without leaking secrets', () => {
  assert.equal(maskCredential('BNK983249823498234XYZ'), 'BNK9••••••••4XYZ');
  assert.equal(maskCredential('short'), '••••••••');
});

test('evaluatePasswordStrength classifies passwords accurately', () => {
  assert.equal(evaluatePasswordStrength('abc').label, 'Weak');
  assert.equal(evaluatePasswordStrength('OxinvoTrade!2026').label, 'Very Strong');
});

test('sanitizeCsvCell neutralizes formula injection prefixes', () => {
  assert.equal(sanitizeCsvCell('=CMD()'), `"'=CMD()"`);
  assert.equal(sanitizeCsvCell('SOL/USDT'), `"SOL/USDT"`);
});
