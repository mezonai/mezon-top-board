import { PaginationQuery, RequestWithId } from '@domain/common/dtos/request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetTempFileRequest extends PaginationQuery {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    ownerId?: string;
}

export class GetOwnTempFileRequest extends PaginationQuery {}

export class SaveTempFileRequest {
  @ApiProperty({ description: 'Temp file id to update', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Directory where the file will be stored' })
  @IsString()
  @IsNotEmpty()
  dir: string;

  @ApiProperty({ description: 'Name of the file to save' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'Mime type of the file' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'Buffer containing the file data' })
  buffer: Buffer;
}