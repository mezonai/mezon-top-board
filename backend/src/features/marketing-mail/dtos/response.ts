import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";

import { Expose } from "class-transformer";

export class GetMailTemplateResponse {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public subject: string;

  @Expose()
  @ApiProperty()
  public content: string;

  @Expose()
  @ApiProperty()
  public scheduledAt: Date;

  @Expose()
  @ApiProperty()
  public isRepeatable: boolean;

  @Expose()
  @ApiPropertyOptional()
  public repeatInterval?: string;
}

export class CreateMailTemplateResponse extends GetMailTemplateResponse {}

export class SearchMailTemplateResponse extends PickType(GetMailTemplateResponse, [
  "id",
  "subject",
  "content",
  "scheduledAt",
  "isRepeatable",
  "repeatInterval",
]) { }
