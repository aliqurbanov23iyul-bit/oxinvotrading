import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnvironment } from './config/environment';
import { CommonModule } from './common/common.module';
import { GlobalExceptionFilter } from './common/http/global-exception.filter';
import { SystemHealthModule } from './system-health/system-health.module';
import { FeatureModules } from './feature-modules';
import { SecurityGuard } from './auth/security.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env', validate: validateEnvironment }), CommonModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 240 }]), SystemHealthModule, ...FeatureModules],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, { provide: APP_GUARD, useClass: SecurityGuard }, { provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
