import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";

import { Expose, Transform } from "class-transformer";

import { SocialLinkInMezonAppDetailResponse } from "@features/linkType/dtos/response";
import { TagInMezonAppDetailResponse } from "@features/tag/dtos/response";
import { OwnerInMezonAppDetailResponse } from "@features/user/dtos/response";
import { AppStatus } from "@domain/common/enum/appStatus";

export class GetMezonAppDetailsResponse {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public prefix: string;

  @Expose()
  @ApiProperty()
  public type: string;

  @Expose()
  @ApiProperty()
  public mezonAppId: string;

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
  public status: string;

  @Expose()
  @ApiProperty()
  public featuredImage: string;

  @Expose()
  @ApiProperty({ type: () => OwnerInMezonAppDetailResponse })
  public owner: OwnerInMezonAppDetailResponse;

  @Expose()
  @ApiProperty({ type: () => [TagInMezonAppDetailResponse] })
  public tags: TagInMezonAppDetailResponse[];

  @Expose()
  @ApiProperty()
  public pricingTag: "FREE" | "PAID";

  @Expose()
  @ApiProperty()
  public price: number;

  @Expose()
  @ApiProperty({ type: () => [SocialLinkInMezonAppDetailResponse] })
  public socialLinks: SocialLinkInMezonAppDetailResponse[];

  @Expose()
  @ApiProperty()
  public rateScore: number;
}

export class SearchMezonAppResponse extends PickType(GetMezonAppDetailsResponse, [
    "id",
    "name",
    "type",
    "mezonAppId",
    "description",
    "headline",
    "status",
    "featuredImage",
    "tags",
    "pricingTag",
    "price",
    "rateScore",
  "owner"
]) { }

export class GetRelatedMezonAppResponse extends OmitType(SearchMezonAppResponse, ["description", "tags", "headline"]) {
}

export class MezonAppInAppReviewResponse extends PickType(GetMezonAppDetailsResponse, [
    "id",
    "name",
    "description",
    "type",
    "mezonAppId",
    "headline",
    "featuredImage",
    "rateScore",
]) {
}