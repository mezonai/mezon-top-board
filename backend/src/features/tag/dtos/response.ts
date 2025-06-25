import { ApiProperty } from "@nestjs/swagger";

import { Expose } from "class-transformer";

export class TagInMezonAppDetailResponse {
    @Expose()
    @ApiProperty()
    public id: string;
    @Expose()
    @ApiProperty()
    public name: string;
}

export class TagResponse extends TagInMezonAppDetailResponse {
    @Expose()
    @ApiProperty()
    public slug: string;

    @Expose()
    @ApiProperty()
    public botCount: number;
}