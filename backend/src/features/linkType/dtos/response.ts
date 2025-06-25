import { ApiProperty } from "@nestjs/swagger";

import { Expose } from "class-transformer";

export class LinkTypeResponse {
  @Expose()
  @ApiProperty()
  public id: string;
  @Expose()
  @ApiProperty()
  public icon: string;
  @Expose()
  @ApiProperty()
  public name: string;
  @Expose()
  @ApiProperty()
  public prefixUrl: string;
}

export class SocialLinkInMezonAppDetailResponse {
  @Expose()
  @ApiProperty()
  public id: string;
  @Expose()
  @ApiProperty()
  public url: string;
  @Expose()
  @ApiProperty()
  public linkTypeId: string;
  @Expose()
  @ApiProperty({ type: () => LinkTypeResponse })
  public type: LinkTypeResponse;
}