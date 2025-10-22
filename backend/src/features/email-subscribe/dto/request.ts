import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsEnum, IsOptional, IsString } from "class-validator";

import { PaginationQuery } from "@domain/common/dtos/request.dto";
import { EmailSubscriptionStatus } from "@domain/common/enum/subscribeTypes";

export class GetEmailSubscriptionRequest {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiPropertyOptional()
    @IsEnum(EmailSubscriptionStatus)
    status: EmailSubscriptionStatus;
}

export class SearchEmailSubscriberRequest extends PaginationQuery {
    @ApiPropertyOptional({
        description: "Keyword to search Subscribers by email",
    })
    @IsOptional()
    search: string;

    @ApiPropertyOptional({ enum: EmailSubscriptionStatus, description: 'Filter by email subscription status' })
    @IsOptional()
    status?: EmailSubscriptionStatus;
}