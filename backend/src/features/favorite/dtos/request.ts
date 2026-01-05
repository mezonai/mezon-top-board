import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { PaginationQuery } from "@domain/common/dtos/request.dto";

export class AddFavoriteAppRequest {
    @ApiProperty()
    @IsUUID()
    id: string;
}

export class GetFavoritesAppRequest extends PaginationQuery {
}