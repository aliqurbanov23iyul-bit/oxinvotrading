import { resolveApiBaseUrl } from '../config/public-config';
import { createApiClient } from './api-client';

let csrfToken: string | undefined;
export const clearApiSession = () => {
  csrfToken = undefined;
};

function determineBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const vercelEnv = import.meta.env.VITE_VERCEL_ENV as string | undefined;
  const isDev = Boolean(import.meta.env.DEV);

  if (configured) {
    const mode = isDev ? 'development' : vercelEnv === 'preview' ? 'preview' : 'production';
    const host = typeof window !== 'undefined' ? window.location.hostname : undefined;
    return resolveApiBaseUrl(configured, isDev, mode, host);
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (host === 'oxinvo.com' || host === 'www.oxinvo.com') {
      return 'https://api.oxinvo.com/api/v1';
    }
  }

  return '/api/v1';
}

const transport = createApiClient({ baseUrl: determineBaseUrl(), csrfToken: () => csrfToken });
let csrfRefresh: Promise<void> | undefined;

export function refreshCsrf(): Promise<void> {
  if (!csrfRefresh) {
    csrfRefresh = transport
      .get<{ csrfToken: string }>('/auth/csrf')
      .then((result) => {
        csrfToken = result.csrfToken;
      })
      .finally(() => {
        csrfRefresh = undefined;
      });
  }
  return csrfRefresh;
}

export const api = {
  get: transport.get,
  post: async <T,>(...args: Parameters<typeof transport.post<T>>) => {
    await refreshCsrf();
    return transport.post<T>(...args);
  },
  patch: async <T,>(...args: Parameters<typeof transport.patch<T>>) => {
    await refreshCsrf();
    return transport.patch<T>(...args);
  },
  delete: async <T,>(...args: Parameters<typeof transport.delete<T>>) => {
    await refreshCsrf();
    return transport.delete<T>(...args);
  },
};

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const systemApi = {
  health: (signal?: AbortSignal) => api.get<{ status: 'ok' }>('/health', { signal }),
  version: (signal?: AbortSignal) =>
    api.get<{ application: string; version: string; apiVersion: string }>('/version', { signal }),
};
// Session and CSRF tokens stay in HttpOnly cookies and memory respectively.
