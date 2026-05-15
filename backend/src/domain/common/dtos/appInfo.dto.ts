import { ApiPropertyOptional, ApiProperty, } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { Expose } from "class-transformer";
import { IsString, IsBoolean, IsOptional, IsArray, MinLength, MaxLength, ArrayMinSize, IsUrl, ValidateIf, IsEnum, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { AppPricing } from "@domain/common/enum/appPricing";
import { AppStatus } from "@domain/common/enum/appStatus";
import { MezonAppType } from "@domain/common/enum/mezonAppType";
import { AppLanguage } from "@domain/common/enum/appLanguage";
import { SocialLinkInMezonAppDetailResponse } from "@features/linkType/dtos/response";
import { TagInMezonAppDetailResponse } from "@features/tag/dtos/response";

export class AppTranslationDto {
  @ApiProperty({ enum: AppLanguage })
  @IsEnum(AppLanguage)
  language: AppLanguage;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(510)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  headline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

class SocialLinkDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsUUID()
  linkTypeId: string;
}

export class CreateAppInfoRequest {
  @ApiProperty({ enum: AppLanguage, default: AppLanguage.EN })
  @IsEnum(AppLanguage)
  defaultLanguage: AppLanguage;

  @ApiProperty({ type: [AppTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppTranslationDto)
  appTranslations: AppTranslationDto[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isAutoPublished?: boolean;

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
  changelog?: string;

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
  pricingTag?: AppPricing;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}

export class GetAppInfoDetailsResponse {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public defaultLanguage: AppLanguage;

  @Expose()
  @ApiProperty({ type: () => [AppTranslationDto] })
  public appTranslations: AppTranslationDto[];

  @Expose()
  @ApiProperty()
  public prefix: string;

  @Expose()
  @ApiProperty()
  public supportUrl: string;

  @Expose()
  @ApiProperty()
  public status: AppStatus;

  @Expose()
  @ApiProperty()
  public featuredImage: string;

  @Expose()
  @ApiProperty()
  public pricingTag: AppPricing;

  @Expose()
  @ApiProperty()
  public price: number;

  @Expose()
  @ApiProperty({ type: () => [TagInMezonAppDetailResponse] })
  public tags: TagInMezonAppDetailResponse[];

  @Expose()
  @ApiProperty({ type: () => [SocialLinkInMezonAppDetailResponse] })
  public socialLinks: SocialLinkInMezonAppDetailResponse[];
}