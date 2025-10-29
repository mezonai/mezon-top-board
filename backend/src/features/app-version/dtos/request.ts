import {
  ApiPropertyOptional,
  ApiProperty,
} from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
  ArrayMinSize,
  IsUrl,
  ValidateIf,
  IsEnum,
  IsNumber,
  IsUUID,
  ValidateNested,
} from "class-validator";

import { AppPricing } from "@domain/common/enum/appPricing";
import { MezonAppType } from "@domain/common/enum/mezonAppType";

class SocialLinkDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsUUID()
  linkTypeId: string;
}

export class CreateAppVersionRequest {
  @ApiProperty()
  @IsString()
  appId: string;

  @ApiProperty()
  @IsString()
  version: string
  
  @ApiPropertyOptional()
  @IsString()
  changelog?: string

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
  @ValidateIf(o => o.type === MezonAppType.BOT)
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

  @ApiPropertyOptional()
  @IsEnum(AppPricing, {
    message: "Pricing tag must be either 'free' or 'paid'",
  })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  pricingTag: AppPricing;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}