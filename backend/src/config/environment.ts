import { plainToInstance } from 'class-transformer';
import { IsIn, IsInt, IsString, Max, Min, validateSync } from 'class-validator';
import { validateDatabaseUrl } from './database-connection.cjs';

class Environment {
  @IsIn(['development', 'test', 'production']) NODE_ENV = 'development';
  @IsInt() @Min(1) @Max(65535) PORT = 4000;
  @IsString() DATABASE_URL!: string;
  @IsIn(['development', 'production', 'test']) DATABASE_ENV = 'development';
  @IsString() NEON_BRANCH_HOST = '';
  @IsString() FRONTEND_URL!: string;
  @IsString() SESSION_SECRET!: string;
  @IsString() ENCRYPTION_KEY!: string;
  @IsIn(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']) LOG_LEVEL = 'info';
  @IsIn(['false', 'loopback']) TRUST_PROXY = 'false';
}

export function decodeKey(value: unknown): Buffer | null {
  if (typeof value !== 'string' || !/^[A-Za-z0-9+/]{43}=$/.test(value)) return null;
  const bytes = Buffer.from(value, 'base64');
  if (bytes.length !== 32 || bytes.toString('base64') !== value || new Set(bytes).size < 12) return null;
  return bytes;
}

export function validateEnvironment(input: Record<string, unknown>): Environment {
  const config = plainToInstance(Environment, {
    ...input,
    PORT: input.PORT === undefined ? 4000 : Number(input.PORT),
  }, { enableImplicitConversion: false });
  const invalid = new Set(validateSync(config).map(error => error.property));
  try {
    validateDatabaseUrl(config.DATABASE_URL, 'runtime', config.NODE_ENV, config.NEON_BRANCH_HOST);
  } catch { invalid.add('DATABASE_URL'); }
  if (config.DATABASE_ENV !== config.NODE_ENV) invalid.add('DATABASE_ENV');
  try {
    const url = new URL(config.FRONTEND_URL);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== config.FRONTEND_URL || url.username || url.password) invalid.add('FRONTEND_URL');
    if (config.NODE_ENV === 'production' && url.protocol !== 'https:') invalid.add('FRONTEND_URL');
  } catch { invalid.add('FRONTEND_URL'); }
  if (!decodeKey(config.SESSION_SECRET)) invalid.add('SESSION_SECRET');
  if (!decodeKey(config.ENCRYPTION_KEY)) invalid.add('ENCRYPTION_KEY');
  if (config.SESSION_SECRET === config.ENCRYPTION_KEY) invalid.add('SESSION_SECRET');
  if (invalid.size) throw new Error(`Invalid environment fields: ${[...invalid].sort().join(', ')}. See backend/.env.example.`);
  return config;
}
