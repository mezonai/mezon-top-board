import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator"

import { PaginationQuery } from "@domain/common/dtos/request.dto"
import { RepeatInterval } from "@domain/common/enum/subscribeTypes"

export class CreateMailTemplateRequest {
  @ApiProperty()
  @IsString()
  subject: string

  @ApiProperty()
  @IsString()
  content: string

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date

  @ApiProperty()
  @IsBoolean()
  isRepeatable: boolean;

  @ApiPropertyOptional()
  @IsEnum(RepeatInterval)
  @IsOptional()
  repeatInterval?: RepeatInterval;
}

export class SearchMailTemplateRequest extends PaginationQuery {
  @ApiPropertyOptional({
    description: "Keyword to search Mail Templates by subject",
  })
  @IsOptional()
  search: string;

  @ApiPropertyOptional({ enum: RepeatInterval, description: 'Filter by repeat interval' })
  @IsOptional()
  repeatInterval?: RepeatInterval;
}
