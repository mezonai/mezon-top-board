import { PaginationQuery, RequestWithId } from '@domain/common/dtos/request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetMediaRequest extends PaginationQuery { }

export class CreateMediaRequest {
    @ApiProperty({ type: String, format: 'binary', required: true })
    file: Express.Multer.File
}

export class DeleteMediaRequest extends RequestWithId { }

export class UpdateMediaRequest extends RequestWithId { }
