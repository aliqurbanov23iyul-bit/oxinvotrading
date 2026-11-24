export type ApiEnvironmentMode = 'development' | 'preview' | 'production' | 'ssr';

const PRODUCTION_API_ORIGIN = 'https://api.oxinvo.com';

export function resolveApiBaseUrl(
  value: string | undefined,
  development: boolean,
  mode?: ApiEnvironmentMode,
  previewHost?: string,
): string {
  const effectiveMode: ApiEnvironmentMode = mode ?? (development ? 'development' : 'production');

  if (effectiveMode === 'ssr') {
    if (!value) return '/api/v1';
    if (value === '/api/v1') return value;
  }

  if (effectiveMode === 'preview') {
    const candidate = (value || '/api/v1').trim();
    if (candidate === '/api/v1') return '/api/v1';
    let url: URL;
    try {
      url = new URL(candidate);
    } catch {
      throw new Error('Invalid public API base URL');
    }
    if (url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== '/api/v1') {
      throw new Error('Invalid public API base URL');
    }
    const normalizedHost = previewHost?.replace(/^https?:\/\//, '').split('/')[0]?.toLowerCase();
    const allowedPreviewOrigin =
      url.origin === PRODUCTION_API_ORIGIN ||
      (url.protocol === 'https:' &&
        (url.hostname.endsWith('.vercel.app') ||
          url.hostname === 'oxinvo.com' ||
          url.hostname === 'www.oxinvo.com' ||
          (normalizedHost ? url.hostname.toLowerCase() === normalizedHost : false)));
    if (!allowedPreviewOrigin) {
      throw new Error('API base URL is outside the allowed environment origin');
    }
    return candidate.replace(/\/$/, '');
  }

  const fallback = effectiveMode === 'development' ? '/api/v1' : `${PRODUCTION_API_ORIGIN}/api/v1`;
  const candidate = value || fallback;
  if (effectiveMode === 'development' && candidate === '/api/v1') return candidate;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('Invalid public API base URL');
  }
  if (url.username || url.password || url.search || url.hash || url.pathname.replace(/\/$/, '') !== '/api/v1') {
    throw new Error('Invalid public API base URL');
  }

  const local =
    ['localhost', '127.0.0.1'].includes(url.hostname) &&
    ['3000', '4000'].includes(url.port) &&
    url.protocol === 'http:';

  if (effectiveMode === 'development' ? !local : url.origin !== PRODUCTION_API_ORIGIN) {
    throw new Error('API base URL is outside the allowed environment origin');
  }
  return candidate.replace(/\/$/, '');
}
