import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { BotWizardStatus } from "@domain/common/enum/botWizardStatus";
import { TempFileInBotWizardResponse } from "@features/temp-storage/dtos/response";

export class GetBotWizardResponse {
  @Expose()
  @ApiProperty()
  public id: string;

  @Expose()
  @ApiProperty()
  public botName: string;

  @Expose()
  @ApiProperty()
  public status: BotWizardStatus;

  @Expose()
  @ApiProperty()
  public language: string;

  @Expose()
  @ApiProperty()
  public templateJson: string

  @Expose()
  @ApiPropertyOptional({ type: () => TempFileInBotWizardResponse })
  @Type(() => TempFileInBotWizardResponse)
  public tempFile?: TempFileInBotWizardResponse;
}
