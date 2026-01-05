import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { PaginationQuery } from "@domain/common/dtos/request.dto";

export class AddFavoriteRequest {
    @ApiProperty()
    @IsUUID()
    id: string;
}

export class GetFavoritesRequest extends PaginationQuery {
}