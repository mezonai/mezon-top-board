import { IntervalUnit, ScheduleMode } from "@domain/common/enum/schedule";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";


export class CreateNewsletterSchedulRequest {
  @ApiProperty({ enum: ScheduleMode, description: "mode schedule" })
  @IsEnum(ScheduleMode)
  mode: ScheduleMode;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  fixedHours?: number[];

  @ApiPropertyOptional({
    type: Number,
    description: "Interval value (e.g. every 5)",
  })
  @IsOptional()
  @IsInt()
  intervalValue?: number;

  @ApiPropertyOptional({
    enum: IntervalUnit,
    description: "Interval unit (minutes | hours | days)",
  })
  @IsOptional()
  @IsEnum(IntervalUnit)
  intervalUnit?: IntervalUnit;
}
