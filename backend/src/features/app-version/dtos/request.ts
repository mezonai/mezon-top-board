import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";

export class CreateAppVersionRequest extends CreateAppInfoRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Name must be at least 1 characters" })
  @MaxLength(64, { message: "Name must not exceed 64 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name?: string;

  @ApiProperty()
  @IsString()
  appId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string
}