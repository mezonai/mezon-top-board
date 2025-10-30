import { ApiPropertyOptional, OmitType, PartialType, IntersectionType, ApiProperty } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsOptional, IsUUID, IsEnum, IsNumber, IsString, MaxLength } from "class-validator";

import { CreateAppInfoRequest } from "@domain/common/dtos/appInfo.dto";
import { PaginationQuery, RequestWithId } from "@domain/common/dtos/request.dto";
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
