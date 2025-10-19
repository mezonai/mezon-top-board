import { ApiProperty } from "@nestjs/swagger";

import { Expose } from "class-transformer";

import { RepeatUnit, SubscriptionStatus } from "@domain/common/enum/subscribeTypes";

export class GetSubscibeResponse {
  @Expose()
  @ApiProperty()
  public email: string;

  @Expose()
  @ApiProperty()
  public isRepeatable: boolean;

  @Expose()
  @ApiProperty()
  public repeatEvery: number;

  @Expose()
  @ApiProperty()
  public repeatUnit: RepeatUnit;

  @Expose()
  @ApiProperty()
  public status: SubscriptionStatus;

  @Expose()
  @ApiProperty()
  public subscribedAt: Date;

  @Expose()
  @ApiProperty()
  public lastSentAt?: Date;
}

export class CreateSubscibeResponse extends GetSubscibeResponse {}
