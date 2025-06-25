import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";

import { Expose } from "class-transformer";

export class OwnerInMezonAppDetailResponse {
    @Expose()
    @ApiProperty()
    public id: string;
    @Expose()
    @ApiProperty()
    public name: string;
    @Expose()
    @ApiProperty()
    public profileImage: string;
}

export class SearchUserResponse {
    @Expose()
    @ApiProperty()
    public id: string;
    @Expose()
    @ApiProperty()
    public name: string;
    @Expose()
    @ApiProperty()
    public email: string;
    @Expose()
    @ApiProperty()
    public bio: string;
    @Expose()
    @ApiProperty()
    public role: string;
    @Expose()
    @ApiProperty()
    public profileImage: string;
    @Expose()
    @ApiProperty()
    public deletedAt: Date | null;
}

export class ReviewerResponse {
    @Expose()
    @ApiProperty()
    public id: string;
    @Expose()
    @ApiProperty()
    public name: string;
    @Expose()
    @ApiProperty()
    public email: string;
    @Expose()
    @ApiProperty()
    public role: string;
}

export class GetUserDetailsResponse extends OmitType(SearchUserResponse, []) {
}
export class GetPublicProfileResponse extends OmitType(SearchUserResponse, ["role", "email"]) { }

export class OwnerInAppRatingResponse extends PickType(SearchUserResponse, [
    "id",
    "name",
    "profileImage",
]) { }