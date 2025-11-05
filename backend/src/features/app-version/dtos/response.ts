import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";

import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

import { GetAppInfoDetailsResponse } from "@domain/common/dtos/appInfo.dto";

export class GetAppVersionDetailsResponse extends GetAppInfoDetailsResponse {
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  public changelog?: string;
}

export class AppVersionInAppReviewResponse extends PickType(GetAppVersionDetailsResponse, [
  "changelog",
]) { }
