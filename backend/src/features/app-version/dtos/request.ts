import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsNumber, IsOptional, IsString } from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";


export class CreateAppVersionRequest extends CreateAppInfoRequest {
  @ApiProperty()
  @IsString()
  appId: string;

  @ApiProperty()
  @IsNumber()
  version: number
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string
}