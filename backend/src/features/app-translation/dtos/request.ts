import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { AppLanguage } from "@domain/common/enum/appLanguage";

export class TranslationRequest {
  @ApiProperty({ enum: AppLanguage })
  @IsEnum(AppLanguage)
  language: AppLanguage;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}