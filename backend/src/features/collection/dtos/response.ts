import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Expose, Type } from "class-transformer";

import { CollectionStatus } from "@domain/common/enum/collectionStatus";

import { GetMezonAppDetailsResponse } from "@features/mezon-app/dtos/response";
import { OwnerInMezonAppDetailResponse } from "@features/user/dtos/response";

export class CollectionResponse {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiPropertyOptional()
    description?: string;

    @Expose()
    @ApiPropertyOptional()
    featuredImage?: string;

    @Expose()
    @ApiProperty({ enum: CollectionStatus })
    status: CollectionStatus;

    @Expose()
    @ApiProperty()
    ownerId: string;

    @Expose()
    @ApiProperty({ type: () => OwnerInMezonAppDetailResponse })
    @Type(() => OwnerInMezonAppDetailResponse)
    owner: OwnerInMezonAppDetailResponse;

    @Expose()
    @ApiProperty({ type: () => [GetMezonAppDetailsResponse] })
    @Type(() => GetMezonAppDetailsResponse)
    apps: GetMezonAppDetailsResponse[];

    @Expose()
    @ApiProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;
}