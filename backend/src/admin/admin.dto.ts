import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsISO8601, ValidateIf, IsString, IsUUID, Matches, Max, MaxLength, Min } from 'class-validator';
import { Language, UserRole, UserStatus } from '../generated/prisma/client';
export class UserQueryDto {
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(64) search?: string;
  @ApiPropertyOptional({ enum: UserStatus }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(UserStatus) status?: UserStatus;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(64) plan?: string;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @ApiPropertyOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) pageSize = 10;
}
export class CreateUserDto {
  @ApiProperty() @IsString() @Matches(/^[a-z0-9][a-z0-9._-]{2,63}$/) username!: string;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(160) fullName?: string;
  @ApiPropertyOptional({ enum: Language }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(Language) preferredLanguage: Language = 'AZ';
  @ApiPropertyOptional({ enum: UserRole }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(UserRole) role: UserRole = 'USER';
  @ApiPropertyOptional({ enum: UserStatus }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(UserStatus) status: UserStatus = 'ACTIVE';
  @ApiProperty() @IsUUID() planId!: string;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) @Max(3650) durationDays = 30;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(2000) notes?: string;
}
export class UpdateUserDto {
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(160) fullName?: string;
  @ApiPropertyOptional({ enum: Language }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(Language) preferredLanguage?: Language;
  @ApiPropertyOptional({ enum: UserRole }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(UserRole) role?: UserRole;
  @ApiPropertyOptional({ enum: UserStatus }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(UserStatus) status?: UserStatus;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(2000) notes?: string;
}
export class SubscriptionDto {
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsUUID() planId?: string;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsISO8601() expirationDate?: string;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @Type(() => Number) @IsInt() @Min(1) @Max(3650) extendDays?: number;
}
