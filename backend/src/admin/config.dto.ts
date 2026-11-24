import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsIn, IsInt, ValidateIf, IsString, Max, MaxLength, Min } from 'class-validator';
import { ProviderName } from '../generated/prisma/client';
export class ProviderDto {
  @ApiProperty({ enum: ProviderName }) @IsEnum(ProviderName) providerName!: ProviderName;
  @ApiProperty() @IsString() @MaxLength(120) modelName!: string;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsBoolean() isEnabled = false;
  @ApiPropertyOptional({ writeOnly: true }) @ValidateIf((_object, value) => value !== undefined) @IsString() @MaxLength(8192) apiKey?: string;
  @ApiPropertyOptional() @ValidateIf((_object, value) => value !== undefined) @IsInt() @Min(0) @Max(100) priority = 0;
}
export class SystemSettingDto {
  @ApiProperty() @IsIn(['maintenanceMode', 'supportContact']) key!: string;
  @ApiProperty() @IsString() @MaxLength(200) value!: string;
}
export class BroadcastDto {
  @ApiProperty() @IsString() @MaxLength(200) title!: string;
  @ApiProperty() @IsString() @MaxLength(3000) message!: string;
}
