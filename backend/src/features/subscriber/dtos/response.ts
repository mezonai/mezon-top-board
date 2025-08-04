import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubscribeResponse {
  @ApiProperty()
  @Expose()
  email: string;
}

export class UnsubscribeResponse {
  @ApiProperty()
  @Expose()
  email: string;
}

export class SubscriberResponse {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}