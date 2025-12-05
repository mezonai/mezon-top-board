import { PaginationQuery, RequestWithId } from '@domain/common/dtos/request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTempFileRequest extends PaginationQuery {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    ownerId?: string;
}

export class GetOwnTempFileRequest extends PaginationQuery {}