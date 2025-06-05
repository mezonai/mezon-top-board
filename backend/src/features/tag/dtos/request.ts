import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString } from "class-validator";

import { PaginationQuery, RequestWithId } from "@domain/common/dtos/request.dto";
export class CreateTagRequest {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    slug: string;
}

export class UpdateTagRequest extends RequestWithId {
    @ApiPropertyOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    slug: string;
}

export class SearchTagRequest extends PaginationQuery {
    @ApiPropertyOptional({ description: "Keyword to search user by name or slug" })
    @IsOptional()
    search: string;
}
