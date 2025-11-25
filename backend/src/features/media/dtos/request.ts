import { PaginationQuery, RequestWithId } from '@domain/common/dtos/request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetMediaRequest extends PaginationQuery {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    ownerId?: string;
}

export class CreateMediaRequest {
    @ApiProperty({ type: String, format: 'binary', required: true })
    file: Express.Multer.File
}

export class DeleteMediaRequest extends RequestWithId { }

export class UpdateMediaRequest extends RequestWithId { }
