import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApplication } from './application';
import { createStructuredLogger, StructuredLogger } from './common/logging/structured-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true, abortOnError: false, bodyParser: false });
  configureApplication(app);
  const config = app.get(ConfigService);
  // Loopback by default on Windows. External exposure is a separate deployment decision.
  await app.listen(config.getOrThrow<number>('PORT'), '127.0.0.1');
  app.get(StructuredLogger).event('info', 'server_started', { port: config.get<number>('PORT'), apiVersion: 1 });
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error && error.message.startsWith('Invalid environment fields:')
    ? error.message : 'Check environment validation and local port configuration. Secret values and exception details omitted.';
  createStructuredLogger('error').error({ event: 'startup_failed', message });
  process.exitCode = 1;
});
