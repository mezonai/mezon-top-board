import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

import { RepeatUnit } from "@domain/common/enum/subscribeTypes"

export class CreateMailRequest {
    @ApiProperty()
    @IsString()
    title: string

    @ApiProperty()
    @IsString()
    subject: string

    @ApiProperty()
    @IsString()
    content: string

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isRepeatable?: boolean;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    repeatEvery?: number;

    @ApiPropertyOptional()
    @IsEnum(RepeatUnit)
    @IsOptional()
    repeatUnit?: RepeatUnit;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    sendTime?: string
}
