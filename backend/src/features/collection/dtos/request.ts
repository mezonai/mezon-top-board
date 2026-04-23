import {
    ApiProperty,
    ApiPropertyOptional
} from "@nestjs/swagger";

import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from "class-validator";

import { CollectionStatus } from "@domain/entities/schema/collection.entity";

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

export class GetMyCollectionsQueryDto {
    @ApiPropertyOptional({ default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageNumber?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number = 10;

    @ApiPropertyOptional({ enum: CollectionStatus })
    @IsEnum(CollectionStatus)
    @IsOptional()
    status?: CollectionStatus;
}

export class SearchCollectionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ enum: CollectionStatus })
    @IsEnum(CollectionStatus)
    @IsOptional()
    status?: CollectionStatus;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    ownerId?: string;

    @ApiPropertyOptional({ default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageNumber?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize?: number = 10;
}