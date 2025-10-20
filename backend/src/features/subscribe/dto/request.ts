import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsEnum, IsString } from "class-validator";

import { SubscriptionStatus } from "@domain/common/enum/subscribeTypes";

export class GetSubscriptionRequest {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiPropertyOptional()
    @IsEnum(SubscriptionStatus)
    status: SubscriptionStatus;
}