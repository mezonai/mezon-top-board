import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsNumber, IsString, IsUUID, Max, Min } from "class-validator";

import { PaginationQuery, RequestWithId } from "@domain/common/dtos/request.dto";

export class GetAppRatingRequest extends PaginationQuery {
    @ApiProperty()
    @IsUUID()
    appId: string;
}
export class GetAllAppRatingRequest {
    @ApiProperty()
    @IsUUID()
    appId: string;
}

export class CreateRatingRequest {
    @ApiProperty()
    @IsUUID()
    appId: string;

    @ApiProperty()
    @IsNumber()
    @Min(0.5)
    @Max(5)
    score: number;

    @ApiPropertyOptional()
    @IsString()
    comment: string;
}

export class UpdateRatingRequest extends RequestWithId {
    @ApiPropertyOptional()
    @IsNumber()
    @Min(0.5)
    @Max(5)
    score: number;

    @ApiPropertyOptional()
    @IsString()
    comment: string;
}