import { resolveApiBaseUrl } from '../config/public-config';
import { createApiClient } from './api-client';

let csrfToken: string | undefined;
export const clearApiSession = () => { csrfToken = undefined; };
const transport = createApiClient({ baseUrl: '/api/v1', csrfToken: () => csrfToken });
let csrfRefresh: Promise<void> | undefined;
export function refreshCsrf(): Promise<void> {
  if (!csrfRefresh) csrfRefresh = transport.get<{csrfToken:string}>('/auth/csrf').then(result=>{csrfToken=result.csrfToken;}).finally(()=>{csrfRefresh=undefined;});
  return csrfRefresh;
}
export const api = { get: transport.get,
  post: async <T,>(...args: Parameters<typeof transport.post<T>>) => { await refreshCsrf(); return transport.post<T>(...args); },
  patch: async <T,>(...args: Parameters<typeof transport.patch<T>>) => { await refreshCsrf(); return transport.patch<T>(...args); },
  delete: async <T,>(...args: Parameters<typeof transport.delete<T>>) => { await refreshCsrf(); return transport.delete<T>(...args); },
};
export const setCsrfToken = (token: string) => { csrfToken = token; };
export const systemApi = {
  health: (signal?: AbortSignal) => api.get<{ status: 'ok' }>('/health', { signal }),
  version: (signal?: AbortSignal) => api.get<{ application: string; version: string; apiVersion: string }>('/version', { signal }),
};
// Session and CSRF tokens stay in HttpOnly cookies and memory respectively.

