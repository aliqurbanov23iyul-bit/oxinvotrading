import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pino, { DestinationStream, Logger } from 'pino';

const sensitiveKey = /password|secret|token|cookie|authorization|apikey|databaseurl|directurl|postgresurl|encryptionkey|sessionsecret/i;
// Defense in depth for structured objects. Request bodies, URLs, headers and
// arbitrary exception messages are never submitted to the production logger.
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 12) return '[TRUNCATED]';
  if (value instanceof Error) return { errorType: value.name };
  if (Array.isArray(value)) return value.map(item => redact(item, depth + 1));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sensitiveKey.test(key.replace(/[_-]/g, '')) ? '[REDACTED]' : redact(item, depth + 1)]));
  return value;
}

export function createStructuredLogger(level: string, destination?: DestinationStream): Logger {
  const options = { level, base: { service: 'oxinvo-backend' }, timestamp: pino.stdTimeFunctions.isoTime,
    redact: { paths: ['password', 'passwordHash', 'apiKey', 'apiSecret', 'sessionToken', 'authorization', 'cookie', 'DATABASE_URL', 'DATABASE_URL_UNPOOLED', 'ENCRYPTION_KEY', 'SESSION_SECRET'], censor: '[REDACTED]' } };
  return destination ? pino(options, destination) : pino(options);
}

@Injectable()
export class StructuredLogger implements LoggerService {
  private readonly logger: Logger;
  constructor(config: ConfigService) { this.logger = createStructuredLogger(config.get<string>('LOG_LEVEL') ?? 'info'); }
  // Nest's free-form messages are deliberately not persisted: they may include
  // rejected DTO values or credentials from library exception messages.
  log(_message: unknown) { this.event('debug', 'framework_event'); }
  error(_message: unknown, ..._details: unknown[]) { this.event('error', 'framework_error'); }
  warn(_message: unknown) { this.event('warn', 'framework_warning'); }
  debug(_message: unknown) { this.event('debug', 'framework_debug'); }
  verbose(_message: unknown) { this.event('trace', 'framework_trace'); }
  fatal(_message: unknown) { this.event('fatal', 'framework_fatal'); }
  event(level: 'info' | 'warn' | 'error' | 'debug' | 'trace' | 'fatal', event: string, data: Record<string, unknown> = {}) {
    this.logger[level]({ ...redact(data) as Record<string, unknown>, event });
  }
}
