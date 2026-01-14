import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { GetMezonAppDetailsResponse } from "@features/mezon-app/dtos/response";
import { TagInMezonAppDetailResponse } from "@features/tag/dtos/response";

export class FavoriteAppResponseDto extends GetMezonAppDetailsResponse { 
    @Expose()
    @ApiProperty({ type: () => [TagInMezonAppDetailResponse] })
    @Type(() => TagInMezonAppDetailResponse)
    public tags: TagInMezonAppDetailResponse[];
}