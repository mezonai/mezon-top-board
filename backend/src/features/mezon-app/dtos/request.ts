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
  IsNotEmpty,
} from "class-validator";

import {
  PaginationQuery,
  RequestWithId,
} from "@domain/common/dtos/request.dto";
import { AppPricing } from "@domain/common/enum/appPricing";
import { MezonAppType } from "@domain/common/enum/mezonAppType";
import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";

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

  @ApiPropertyOptional({ description: "Filter by has new update" })
  @IsOptional()
  hasNewUpdate?: boolean;
}

export class CreateMezonAppRequest extends CreateAppInfoRequest {
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
