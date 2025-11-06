import { ApiProperty, ApiPropertyOptional, IntersectionType, OmitType, PartialType } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";
import { RequestWithId } from "@domain/common/dtos/request.dto";


export class CreateAppVersionRequest extends PartialType(CreateAppInfoRequest) {
  @ApiProperty()
  @IsString()
  appId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string
}

export class UpdateAppVersionRequest extends IntersectionType(
  RequestWithId,
  PartialType(OmitType(CreateAppVersionRequest, [] as const)),
) { }