import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";
import { Tag } from "@domain/entities";

export class CreateAppVersionRequest extends PartialType(CreateAppInfoRequest) {
  @ApiProperty()
  @IsString()
  appId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  changelog?: string

  @ApiPropertyOptional({ type: [Tag] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  tags?: Tag[];
}