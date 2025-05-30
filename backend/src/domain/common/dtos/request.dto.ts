import { ApiProperty } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { SortField } from "../enum/sortField";
import { SortOrder } from "../enum/sortOder";

export class RequestWithId {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
  constructor(id?: string) {
    if (id) this.id = id;
  }
}

export class PaginationQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageSize: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageNumber: number = 1;

  @IsOptional()
  @IsIn(Object.values(SortField))
  sortField: SortField = SortField.NAME;

  @IsOptional()
  @IsIn([SortOrder.ASC, SortOrder.DESC])
  sortOrder: SortOrder = SortOrder.ASC;
}