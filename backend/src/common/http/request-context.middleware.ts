import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { StructuredLogger } from '../logging/structured-logger';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly logger: StructuredLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    // Always server-generated: untrusted client IDs cannot poison/correlate logs.
    const requestId = randomUUID();
    res.locals.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    const started = performance.now();
    res.on('finish', () => this.logger.event('info', 'http_request', {
      requestId, method: req.method,
      statusCode: res.statusCode, durationMs: Math.round(performance.now() - started),
    }));
    next();
  }
}
