import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, ValidateIf, IsString, Max, MaxLength, Min, IsIn, MinLength } from 'class-validator';
import { Language } from '../generated/prisma/client';
export class ProfileDto {
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(160) fullName?: string;
  @ApiPropertyOptional({ enum: Language }) @ValidateIf((_object, value) => value !== undefined) @IsEnum(Language) preferredLanguage?: Language;
}
export class CredentialsDto {
  @ApiProperty({ writeOnly: true }) @IsString() @MinLength(1) @MaxLength(8192) apiKey!: string;
  @ApiProperty({ writeOnly: true }) @IsString() @MinLength(1) @MaxLength(8192) apiSecret!: string;
}
export class SettingsDto {
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsIn(['Adaptive Momentum', 'Breakout Volume Surge', 'Mean Reversion', 'Liquidity Impulse']) strategy?: string;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsInt() @Min(1) @Max(100) maxAllocation?: number;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsInt() @Min(1) @Max(100) stopLoss?: number;
}
