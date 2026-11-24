import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityGuard } from './security.guard';
@Global()
@Module({ providers: [AuthService, SecurityGuard], controllers: [AuthController], exports: [AuthService, SecurityGuard] })
export class AuthModule {}
