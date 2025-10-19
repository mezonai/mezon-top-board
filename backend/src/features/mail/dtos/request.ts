import { ApiProperty } from "@nestjs/swagger"

import { IsArray, IsString } from "class-validator"

export class CreateMailRequest {
    @ApiProperty()
    @IsString()
    title: string

    @ApiProperty()
    @IsString()
    subject: string

    @ApiProperty()
    @IsString()
    content: string

    @ApiProperty()
    @IsArray()
    subscriberIds: string[]
}
