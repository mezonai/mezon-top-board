import {
  ApiPropertyOptional,
  ApiProperty,
  OmitType,
  PartialType,
  IntersectionType,
} from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  MinLength,
  MaxLength,
  ArrayMinSize,
  IsUrl,
  ValidateIf,
} from "class-validator";

import {
  PaginationQuery,
  RequestWithId,
} from "@domain/common/dtos/request.dto";

export class SearchMezonAppRequest extends PaginationQuery {
  @ApiPropertyOptional({
    description: "Keyword to search mezonApps by name or headline",
  })
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId: string;
}

class SocialLinkDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsUUID()
  linkTypeId: string;
}

export class CreateMezonAppRequest {
  @IsString()
  @IsUUID()
  @Transform(({ value }) => value?.trim())
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: "Name must be at least 1 characters" })
  @MaxLength(64, { message: "Name must not exceed 64 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAutoPublished?: boolean;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  type: 'bot' | 'app';

  @IsString()
  @MaxLength(2042, { message: 'Bot ID must not exceed 2042 characters' })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  botId: string;
 
  @ApiPropertyOptional()
  @IsString()
  @MinLength(50, { message: "Headline must be at least 50 characters" })
  @MaxLength(510, { message: "Headline must not exceed 510 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  headline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(1, { message: "Prefix must be at least 1 character" })
  @MaxLength(10, { message: "Prefix must not exceed 10 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  prefix?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @ValidateIf(o => o.supportUrl !== '' && o.supportUrl !== null)
  @IsUrl(undefined, { message: "Support URL Invalid URL format" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  supportUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  remark?: string;
 
  @ApiPropertyOptional()
  @IsArray()
  @ArrayMinSize(1, { message: "At least one tag is required" })
  @IsString({ each: true })
  tagIds: string[];

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}

export class UpdateMezonAppRequest extends IntersectionType(
  RequestWithId,
  PartialType(OmitType(CreateMezonAppRequest, [] as const)),
) {}
