import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";

import { RepeatUnit } from "@domain/common/enum/subscribeTypes";


export class GetSubscriptionRequest {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiPropertyOptional()
    @IsBoolean()
    isRepeatable?: boolean;

    @ApiPropertyOptional()
    @IsNumber()
    repeatEvery?: number;

    @ApiPropertyOptional()
    @IsEnum(RepeatUnit)
    repeatUnit?: RepeatUnit;

    @ApiProperty()
    @IsString()
    sendTime?: string
}