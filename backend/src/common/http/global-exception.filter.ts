import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { StructuredLogger } from '../logging/structured-logger';
import { AuthService } from '../../auth/auth.service';
import { DatabaseService } from '../../database/database.service';
import { AuthRequest } from '../../auth/auth.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: StructuredLogger, private readonly auth: AuthService, private readonly db: DatabaseService) {}
  async catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500;
    if (statusCode === 403) {
      const req = host.switchToHttp().getRequest<AuthRequest>();
      try { await this.db.system(tx => this.auth.audit(tx, 'UNAUTHORIZED_ACCESS', req.auth?.user.id ?? null, null, { statusCode: 403 }, req.ip)); } catch { /* retain safe error response if audit storage is unavailable */ }
    }
    const message = ({ 400: 'Invalid request', 401: 'Authentication required', 403: 'Access denied', 404: 'Not found', 413: 'Request too large', 429: 'Too many requests', 503: 'Service unavailable' } as Record<number, string>)[statusCode] ?? 'Request failed';
    this.logger.event(statusCode >= 500 ? 'error' : 'warn', 'request_failed', {
      requestId: response.locals.requestId, statusCode,
    });
    response.status(statusCode).json({ statusCode, message, requestId: response.locals.requestId });
  }
}
