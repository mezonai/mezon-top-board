import {
    ApiProperty,
    ApiPropertyOptional
} from "@nestjs/swagger";

import { Transform } from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from "class-validator";

import { CollectionStatus } from "@domain/common/enum/collectionStatus";
import { PaginationQuery } from "@domain/common/dtos/request.dto";

export class CreateCollectionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Transform(({ value }) => value?.trim())
    title: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    featuredImage?: string;

    @ApiPropertyOptional({ enum: CollectionStatus, default: CollectionStatus.PRIVATE })
    @IsEnum(CollectionStatus)
    @IsOptional()
    status?: CollectionStatus;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsUUID(undefined, { each: true })
    @IsOptional()
    appIds?: string[];
}

export class UpdateCollectionDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @Transform(({ value }) => value?.trim())
    title?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    featuredImage?: string;

    @ApiPropertyOptional({ enum: CollectionStatus })
    @IsEnum(CollectionStatus)
    @IsOptional()
    status?: CollectionStatus;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsUUID(undefined, { each: true })
    @IsOptional()
    appIds?: string[];
}

export class CollectionPaginationDto extends PaginationQuery {
    @ApiPropertyOptional({ enum: CollectionStatus })
    @IsEnum(CollectionStatus)
    @IsOptional()
    status?: CollectionStatus;
}

export class GetMyCollectionsQueryDto extends CollectionPaginationDto {}

export class SearchCollectionsDto extends CollectionPaginationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    ownerId?: string;
}