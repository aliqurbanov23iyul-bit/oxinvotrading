import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthRequest } from './auth.types';
import { DatabaseService } from '../database/database.service';
@Injectable()
export class SecurityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly auth: AuthService, private readonly db: DatabaseService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const targets = [context.getHandler(), context.getClass()];
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      try { this.auth.verifyCsrf(req); } catch {
        await this.db.system(tx => this.auth.audit(tx, 'UNAUTHORIZED_ACCESS', null, null, { reason: 'csrf' }, req.ip)); throw new ForbiddenException();
      }
    }
    if (this.reflector.getAllAndOverride<boolean>('public', targets)) return true;
    const auth = await this.auth.authenticate(req);
    if (!auth) { await this.db.system(tx => this.auth.audit(tx, 'UNAUTHORIZED_ACCESS', null, null, { reason: 'session' }, req.ip)); throw new UnauthorizedException(); }
    req.auth = auth;
    if (auth.user.mustChangePassword && !this.reflector.getAllAndOverride<boolean>('allowPasswordChange', targets)) throw new ForbiddenException({ code: 'PASSWORD_CHANGE_REQUIRED' });
    const roles = this.reflector.getAllAndOverride<string[]>('roles', targets);
    if (roles && !roles.includes(auth.user.role)) { await this.db.system(tx => this.auth.audit(tx, 'UNAUTHORIZED_ACCESS', auth.user.id, null, { reason: 'role' }, req.ip)); throw new ForbiddenException(); }
    return true;
  }
}
