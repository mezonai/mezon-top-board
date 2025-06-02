import { ApiProperty, IntersectionType, PartialType } from "@nestjs/swagger";

import { IsString } from "class-validator";

import {
  RequestWithId,
} from "@domain/common/dtos/request.dto";

export class CreateLinkTypeRequest {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  prefixUrl: string;

  @ApiProperty()
  @IsString()
  icon: string;
}

export class UpdateLinkTypeRequest extends IntersectionType(
  RequestWithId,
  PartialType(CreateLinkTypeRequest),
) {}