import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { StructuredLogger } from './common/logging/structured-logger';
import { RequestContextMiddleware } from './common/http/request-context.middleware';

export function configureApplication(app: INestApplication): void {
  const config = app.get(ConfigService);
  app.useLogger(app.get(StructuredLogger));
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.getHttpAdapter().getInstance().set('trust proxy', config.get('TRUST_PROXY') === 'loopback' ? 'loopback' : false);
  const requestContext = app.get(RequestContextMiddleware);
  app.use(requestContext.use.bind(requestContext));
  app.use(helmet({ strictTransportSecurity: config.get('NODE_ENV') === 'production' ? undefined : false }));
  app.use(json({ limit: '32kb' }));
  app.use(urlencoded({ extended: false, limit: '32kb' }));
  const allowed = config.getOrThrow<string>('FRONTEND_URL');
  app.enableCors({ origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => callback(null, origin === allowed), credentials: true,
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'X-Request-ID', 'X-CSRF-Token'], exposedHeaders: ['X-Request-ID'] });
  app.use((_req: unknown, res: import('express').Response, next: () => void) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true,
    forbidUnknownValues: true, validationError: { target: false, value: false },
    transformOptions: { enableImplicitConversion: false } }));
  if (config.get('NODE_ENV') === 'development') {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('OXINVO infrastructure API')
      .setDescription('Session-authenticated OXINVO API. Mutations require exact Origin and X-CSRF-Token from auth/csrf. No public registration or exchange execution.')
      .addCookieAuth('oxinvo_session').setVersion('0.2.0').build());
    SwaggerModule.setup('api/docs', app, document, { swaggerOptions: { persistAuthorization: false } });
  }
  app.enableShutdownHooks();
}
