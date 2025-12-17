import { PaginationQuery } from "@domain/common/dtos/request.dto";
import { BotWizardStatus } from "@domain/common/enum/botWizardStatus";
import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BotWizardRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  botName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  language: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  integrations?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  events?: EventWizardRequest[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  commands?: CommandWizardRequest[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateJson: string;
}

export class CommandWizardRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  command: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  aliases: string[];
}

export class EventWizardRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventType: string;
}

export class GetBotWizardRequest extends PaginationQuery {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  ownerId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  botName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  language?: string;

  @IsOptional()
  @IsEnum(BotWizardStatus)
  @ApiProperty({ required: false })
  status?: BotWizardStatus;
}

export class GetOwnBotWizardRequest extends OmitType(
  GetBotWizardRequest,
  ['ownerId'] as const,
) {}