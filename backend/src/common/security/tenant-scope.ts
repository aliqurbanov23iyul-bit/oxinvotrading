// Internal boundary contract for Stage 3. It is NOT authentication and must only
// be constructed from a verified, active server-side session, never request.userId.
export interface TenantScope { readonly userId: string }

export function requireTenantScope(scope: TenantScope): Readonly<{ userId: string }> {
  if (!scope || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(scope.userId)) {
    throw new Error('Verified tenant scope required');
  }
  return Object.freeze({ userId: scope.userId });
}
