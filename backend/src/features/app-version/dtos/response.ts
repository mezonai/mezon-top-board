import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";

import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

import { GetAppInfoDetailsResponse } from "@domain/common/dtos/appInfo.dto";

export class GetAppVersionDetailsResponse extends GetAppInfoDetailsResponse {
  @Expose()
  @ApiProperty()
  public appId: string;

  @Expose()
  @ApiProperty()
  public version: number;

  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  public changelog?: string;
}

export class AppVersionInAppReviewResponse extends PickType(GetAppVersionDetailsResponse, [
  "id",
  "version",
  "changelog",
]) {
}