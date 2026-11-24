import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Req, Res, HttpCode } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';
import { AllowPasswordChange, AuthRequest, Public } from './auth.types';
import { ChangePasswordDto, LoginDto } from './auth.dto';
@ApiTags('Authentication') @ApiCookieAuth()
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly db: DatabaseService) {}
  @Public() @Get('csrf') @ApiOperation({ summary: 'Issue an in-memory CSRF token; matching HttpOnly cookie is required for mutations' })
  csrf(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) { return { csrfToken: this.auth.csrf(req, res) }; }
  @Public() @Post('login') @HttpCode(200) @Throttle({ default: { limit: 30, ttl: 60000 } }) @ApiOperation({ summary: 'Username/password login with Argon2id and opaque HttpOnly session' })
  login(@Body() dto: LoginDto, @Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) { return this.auth.login(dto, req, res); }
  @AllowPasswordChange() @Get('me') @ApiOperation({ summary: 'Current verified session, without hashes or tokens' })
  me(@Req() req: AuthRequest) { return { user: req.auth!.user }; }
  @AllowPasswordChange() @Post('logout') @HttpCode(200)
  logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) { return this.auth.logout(req.auth!, res, req); }
  @AllowPasswordChange() @Post('change-password') @HttpCode(200) @Throttle({ default: { limit: 10, ttl: 60000 } })
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) { return this.auth.changePassword(req.auth!, dto, req, res); }
  @Get('sessions')
  sessions(@Req() req: AuthRequest) { return this.db.system(tx => tx.session.findMany({ where: { userId: req.auth!.user.id, revokedAt: null, expiresAt: { gt: new Date() } }, select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true } })); }
  @Delete('sessions/:id')
  revoke(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest) { return this.db.system(async tx => { await tx.session.updateMany({ where: { id, userId: req.auth!.user.id }, data: { revokedAt: new Date() } }); await this.auth.audit(tx, 'SESSION_REVOKED', req.auth!.user.id, req.auth!.user.id); return { ok: true }; }); }
}
