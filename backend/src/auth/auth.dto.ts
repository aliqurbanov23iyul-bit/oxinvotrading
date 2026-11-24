import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, ValidateIf, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class LoginDto {
  @ApiProperty() @IsString() @Matches(/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,63}$/) username!: string;
  @ApiProperty({ writeOnly: true }) @IsString() @MinLength(1) @MaxLength(128) password!: string;
  @ApiPropertyOptional({ default: false }) @ValidateIf((_object, value) => value !== undefined) @IsBoolean() rememberMe = false;
}
export class ChangePasswordDto {
  @ApiProperty({ writeOnly: true }) @IsString() @MinLength(1) @MaxLength(128) currentPassword!: string;
  @ApiProperty({ writeOnly: true, minLength: 12 }) @IsString() @MinLength(12) @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/s) newPassword!: string;
}
