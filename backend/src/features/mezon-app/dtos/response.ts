import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";

import { Expose, Transform } from "class-transformer";

import { SocialLinkInMezonAppDetailResponse } from "@features/linkType/dtos/response";
import { TagInMezonAppDetailResponse } from "@features/tag/dtos/response";
import { OwnerInMezonAppDetailResponse } from "@features/user/dtos/response";
import { AppStatus } from "@domain/common/enum/appStatus";
import { GetAppInfoDetailsResponse } from "@domain/common/dtos/appInfo.dto";
import { GetAppVersionDetailsResponse } from "@features/app-version/dtos/response";

export class GetMezonAppDetailsResponse extends GetAppInfoDetailsResponse {
  @Expose()
  @ApiProperty()
  public type: string;

  @Expose()
  @ApiProperty()
  public mezonAppId: string;

  @Expose()
  @ApiProperty()
  public currentVersion: number;

  @Expose()
  @ApiProperty()
  public hasNewUpdate: boolean;

  // TODO: fix with exposeUnsetFields later in class-transformer
  @Expose()
  @ApiProperty({ type: () => OwnerInMezonAppDetailResponse })
  public owner: OwnerInMezonAppDetailResponse;

  @Expose()
  @ApiProperty()
  public rateScore: number;

  @Expose()
  @ApiProperty({ type: () => [GetAppVersionDetailsResponse] })
  public versions: GetAppVersionDetailsResponse[];
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
  "owner",
  "versions",
  "hasNewUpdate"
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