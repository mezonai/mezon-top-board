import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
  commands?: CommandWizardRequest[];
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
  @IsOptional()
  aliases: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  className: string;
}