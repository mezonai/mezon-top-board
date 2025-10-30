import { ApiProperty } from "@nestjs/swagger";

import { Expose } from "class-transformer";

import { AppPricing } from "@domain/common/enum/appPricing";
import { AppStatus } from "@domain/common/enum/appStatus";

import { SocialLinkInMezonAppDetailResponse } from "@features/linkType/dtos/response";
import { TagInMezonAppDetailResponse } from "@features/tag/dtos/response";

export class GetAppVersionDetailsResponse {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public appId: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public prefix: string;

  @Expose()
  @ApiProperty()
  public supportUrl: string;

  @Expose()
  @ApiProperty()
  public description: string;

  @Expose()
  @ApiProperty()
  public headline: string;

  @Expose()
  @ApiProperty()
  public status: AppStatus;

  @Expose()
  @ApiProperty()
  public featuredImage: string;

  @Expose()
  @ApiProperty({ type: () => [TagInMezonAppDetailResponse] })
  public tags: TagInMezonAppDetailResponse[];

  @Expose()
  @ApiProperty()
  public pricingTag: AppPricing;

  @Expose()
  @ApiProperty()
  public price: number;

  @Expose()
  @ApiProperty()
  public version: number;

  @Expose()
  @ApiProperty({ type: () => [SocialLinkInMezonAppDetailResponse] })
  public socialLinks: SocialLinkInMezonAppDetailResponse[];
}

