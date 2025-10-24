import { ApiProperty, PickType } from "@nestjs/swagger";

import { Expose } from "class-transformer";

import { EmailSubscriptionStatus } from "@domain/common/enum/subscribeTypes";

export class GetEmailSubscibeResponse {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public email: string;

  @Expose()
  @ApiProperty()
  public status: EmailSubscriptionStatus;
}

export class CreateSubscibeResponse extends GetEmailSubscibeResponse { }

export class SearchEmailSubscriberResponse extends PickType(GetEmailSubscibeResponse, [
  "id",
  "email",
  "status",
]) { }