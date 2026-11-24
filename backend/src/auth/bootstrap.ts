import { PrismaClient } from '../generated/prisma/client';
import { PasswordService } from '../common/security/password.service';
import { generatePassword } from './credentials';

// Returns a password only to the one-time TTY caller or isolated test harness.
// Never call this from an HTTP endpoint or scheduled job.
export async function bootstrapSuperAdmin(client: PrismaClient) {
  return client.$transaction(async tx => {
    await tx.$executeRaw`SELECT set_config('oxinvo.admin','true',true)`;
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('oxinvo.user-management'))`;
    if (await tx.user.count({ where: { role: 'SUPER_ADMIN' } })) return { created: false as const };
    if (await tx.user.findUnique({ where: { username: 'oxinvo.admin' } })) throw new Error('Bootstrap username already exists');
    const password = generatePassword(24);
    const user = await tx.user.create({ data: { username: 'oxinvo.admin', fullName: 'OXINVO Administrator', role: 'SUPER_ADMIN', passwordHash: await new PasswordService().hash(password), mustChangePassword: true }, select: { id: true, username: true } });
    for (const name of ['trial', 'standard', 'professional', 'custom']) await tx.subscriptionPlan.upsert({ where: { name }, create: { name, description: 'Access label only; billing not configured', durationDays: 30, price: '0', currency: 'USD', features: {} }, update: {} });
    await tx.auditLog.create({ data: { actorUserId: user.id, targetUserId: user.id, action: 'USER_CREATED', resource: 'bootstrap', resourceId: user.id, metadata: { role: 'SUPER_ADMIN' } } });
    return { created: true as const, username: user.username, password };
  }, { timeout: 30000, maxWait: 15000 });
}
