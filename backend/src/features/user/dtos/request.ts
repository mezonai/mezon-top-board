import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";

import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

import { PaginationQuery, RequestWithId } from "@domain/common/dtos/request.dto";
import { Role } from "@domain/common/enum/role";
import { Transform } from "class-transformer";

export class SearchUserRequest extends PaginationQuery {
    @ApiPropertyOptional({ description: "Keyword to search user by name or email" })
    @IsOptional()
    search: string;
}

export class GetPublicProfileInfoRequest {
  @ApiPropertyOptional({
    description: "userId",
  })
  @IsUUID()
  userId: string;
}

export class UpdateUserRequest extends RequestWithId {
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(3, { message: 'Name must be at least 3 character' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  name: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  bio: string;
  @ApiPropertyOptional()
  @IsOptional()
  role: Role;
  @ApiPropertyOptional()
  @IsOptional()
  profileImage: string;
}

export class SelfUpdateUserRequest extends OmitType(UpdateUserRequest, ["id", "role"]) { }