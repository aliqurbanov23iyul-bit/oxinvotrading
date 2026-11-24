import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';
import { Public } from '../auth/auth.types';

class HealthResponse { @ApiProperty({ example: 'ok' }) status!: string; }
class VersionResponse {
  @ApiProperty({ example: 'OXINVO' }) application!: string;
  @ApiProperty({ example: '0.1.0' }) version!: string;
  @ApiProperty({ example: '1' }) apiVersion!: string;
}

@ApiTags('System')
@Public()
@Controller({ version: '1' })
export class SystemHealthController {
  constructor(private readonly database: DatabaseService) {}
  @Get('health') @ApiOkResponse({ type: HealthResponse })
  health(): HealthResponse { return { status: 'ok' }; }
  @Get('health/database') @ApiOkResponse({ type: HealthResponse }) @ApiServiceUnavailableResponse({ description: 'Database unavailable. No connection details disclosed.' })
  async databaseHealth(): Promise<HealthResponse> {
    if (!await this.database.isReady()) throw new ServiceUnavailableException();
    return { status: 'ok' };
  }
  @Get('version') @ApiOkResponse({ type: VersionResponse })
  version(): VersionResponse { return { application: 'OXINVO', version: '0.1.0', apiVersion: '1' }; }
}
