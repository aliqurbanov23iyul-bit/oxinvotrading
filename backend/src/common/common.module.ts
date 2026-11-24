import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './security/encryption.service';
import { PasswordService } from './security/password.service';
import { StructuredLogger } from './logging/structured-logger';
import { RequestContextMiddleware } from './http/request-context.middleware';

@Global()
@Module({ providers: [EncryptionService, PasswordService, StructuredLogger, RequestContextMiddleware], exports: [EncryptionService, PasswordService, StructuredLogger, RequestContextMiddleware] })
export class CommonModule {}
