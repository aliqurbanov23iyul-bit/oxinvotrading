import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { Prisma, UserRole } from '../generated/prisma/client';
export const Public = () => SetMetadata('public', true);
export const AllowPasswordChange = () => SetMetadata('allowPasswordChange', true);
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
export const publicUserSelect = { id: true, username: true, fullName: true, role: true, status: true,
  preferredLanguage: true, mustChangePassword: true, createdAt: true, updatedAt: true, lastLoginAt: true,
  notes: true } satisfies Prisma.UserSelect;
export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;
export interface AuthContext { user: PublicUser; sessionId: string; expiresAt: Date; rememberMe: boolean }
export interface AuthRequest extends Request { auth?: AuthContext }
