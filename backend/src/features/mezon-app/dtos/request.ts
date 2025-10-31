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
  IsEnum,
  IsNumber,
} from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";
import {
  PaginationQuery,
  RequestWithId,
} from "@domain/common/dtos/request.dto";
import { AppPricing } from "@domain/common/enum/appPricing";
import { MezonAppType } from "@domain/common/enum/mezonAppType";

export class SearchMezonAppRequest extends PaginationQuery {
  @ApiPropertyOptional({
    description: "Keyword to search mezonApps by name or headline",
  })
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional({ enum: AppPricing })
  @IsOptional()
  @IsEnum(AppPricing, { message: "Invalid pricing tag" })
  pricingTag: AppPricing;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ownerId: string;

  @ApiPropertyOptional({ enum: MezonAppType, description: 'Filter by bot or app type' })
  @IsOptional()
  type?: MezonAppType;
}

export class CreateMezonAppRequest extends CreateAppInfoRequest {
  @ApiProperty()
  @IsString()
  @MinLength(1, { message: "Name must be at least 1 characters" })
  @MaxLength(64, { message: "Name must not exceed 64 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name: string;

  @ApiProperty({ enum: MezonAppType })
  @IsEnum(MezonAppType, { message: "Type must be either 'app' or 'bot'" })
  type: MezonAppType;

  @IsString()
  @MaxLength(2042, { message: 'Bot ID must not exceed 2042 characters' })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  mezonAppId: string;
}

export class UpdateMezonAppRequest extends IntersectionType(
  RequestWithId,
  PartialType(OmitType(CreateMezonAppRequest, [] as const)),
) {}
