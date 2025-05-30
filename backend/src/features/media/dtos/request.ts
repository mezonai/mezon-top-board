import { ApiProperty } from '@nestjs/swagger';

import { PaginationQuery, RequestWithId } from '@domain/common/dtos/request.dto';

export class GetMediaRequest extends PaginationQuery { }

export class CreateMediaRequest {
    @ApiProperty({ type: String, format: 'binary', required: true })
    file: Express.Multer.File
}

export class DeleteMediaRequest extends RequestWithId { }

export class UpdateMediaRequest extends RequestWithId { }
