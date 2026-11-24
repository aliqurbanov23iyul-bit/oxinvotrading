import { randomInt } from 'node:crypto';
export function generatePassword(length = 24): string {
  const groups = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!@#$%^&*-_=+?'];
  const all = groups.join(''); const values = groups.map(group => group[randomInt(group.length)]!);
  while (values.length < Math.max(20, length)) values.push(all[randomInt(all.length)]!);
  for (let i = values.length - 1; i > 0; i--) { const j = randomInt(i + 1); [values[i], values[j]] = [values[j]!, values[i]!]; }
  return values.join('');
}
