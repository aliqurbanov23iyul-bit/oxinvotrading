export function resolveApiBaseUrl(value: string | undefined, development: boolean): string {
  const fallback = development ? '/api/v1' : 'https://api.oxinvo.com/api/v1';
  const candidate = value || fallback;
  if (development && candidate === '/api/v1') return candidate;
  let url: URL;
  try { url = new URL(candidate); } catch { throw new Error('Invalid public API base URL'); }
  if (url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== '/api/v1') throw new Error('Invalid public API base URL');
  const local = ['localhost', '127.0.0.1'].includes(url.hostname) && url.port === '4000' && url.protocol === 'http:';
  if (development ? !local : url.origin !== 'https://api.oxinvo.com') throw new Error('API base URL is outside the allowed environment origin');
  return candidate.replace(/\/$/, '');
}
