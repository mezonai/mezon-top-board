import { PaginationQuery } from '@domain/common/dtos/request.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SubscribeRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class UnsubscribeRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}
export class SearchSubscriberRequest extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}