import { ApiProperty } from "@nestjs/swagger";

import { Expose, Type } from "class-transformer";

import { GetSubscibeResponse } from "@features/subscribe/dto/response";

export class GetAppMailResponse {
  @Expose()
  @ApiProperty()
  public id: string;

    @Expose()
    @ApiProperty()
    public title: string;

    @Expose()
    @ApiProperty()
    public subject: string;

    @Expose()
    @ApiProperty()
    public content: string;

    @Expose()
    @ApiProperty({ type: () => [GetSubscibeResponse] })
    @Type(() => GetSubscibeResponse)
    public subscribers: GetSubscibeResponse[];

}

export class CreateAppMailResponse extends GetAppMailResponse {}
