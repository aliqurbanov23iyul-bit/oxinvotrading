export class ApiError extends Error {
  constructor(readonly status: number, readonly requestId: string | null) {
    super('API request failed'); this.name = 'ApiError';
  }
}

type RequestOptions = { signal?: AbortSignal; body?: unknown };
type ClientOptions = { baseUrl: string; fetch?: typeof fetch; timeoutMs?: number; csrfToken?: () => string | undefined };

// No token persistence, no retries of mutations, and no authentication simulation.
// The server verifies session-bound CSRF and the exact frontend origin.
export function createApiClient(options: ClientOptions) {
  const fetcher = options.fetch ?? globalThis.fetch;
  async function request<T>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, requestOptions: RequestOptions = {}): Promise<T> {
    const pathname = path.split('?')[0]!;
    if (!/^\/[a-z0-9][a-z0-9/-]*$/i.test(pathname) || pathname.includes('//') || pathname.includes('..') || path.includes('#')) throw new Error('Invalid API path');
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (method !== 'GET') {
      const token = options.csrfToken?.();
      if (!token) throw new Error('CSRF token required');
      headers['X-CSRF-Token'] = token;
    }
    if (requestOptions.body !== undefined) headers['Content-Type'] = 'application/json';
    const timeout = AbortSignal.timeout(options.timeoutMs ?? 10000);
    const signal = requestOptions.signal ? AbortSignal.any([timeout, requestOptions.signal]) : timeout;
    const response = await fetcher(options.baseUrl.replace(/\/$/, '') + path, {
      method, headers, credentials: 'include', signal, redirect: 'error', cache: 'no-store',
      body: requestOptions.body === undefined ? undefined : JSON.stringify(requestOptions.body),
    });
    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') window.dispatchEvent(new Event('oxinvo:unauthorized'));
      throw new ApiError(response.status, response.headers.get('X-Request-ID'));
    }
    if (response.status === 204) return undefined as T;
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Unexpected API response type');
    return response.json() as Promise<T>;
  }
  return {
    get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
    post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
    patch: <T>(path: string, options?: RequestOptions) => request<T>('PATCH', path, options),
    delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
  };
}
