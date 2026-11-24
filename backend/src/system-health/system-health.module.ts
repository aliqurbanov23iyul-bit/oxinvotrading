import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SystemHealthController } from './system-health.controller';
@Module({ imports: [DatabaseModule], controllers: [SystemHealthController] })
export class SystemHealthModule {}
