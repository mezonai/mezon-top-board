import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

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

export class UpdateLinkTypeRequest extends RequestWithId {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  prefixUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;
}
