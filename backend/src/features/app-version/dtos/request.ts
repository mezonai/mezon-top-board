import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";


export class CreateAppVersionRequest extends PartialType(CreateAppInfoRequest) {
  @ApiProperty()
  @IsString()
  appId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string
}