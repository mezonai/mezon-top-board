import { ApiProperty } from "@nestjs/swagger";

import { Expose } from "class-transformer";
import { IntervalUnit, ScheduleMode } from "@domain/common/enum/schedule";

export class NewsletterScheduleResponse {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ enum: ScheduleMode })
  @Expose()
  mode: ScheduleMode;

  @ApiProperty({
    required: false,
    type: Number,
    description: "Hour of day if fixed mode",
  })
  @Expose()
  fixedHour?: number;

  @ApiProperty()
  @Expose()
  interval?: {
    value: number;
    unit: IntervalUnit;
  };

  @ApiProperty({ description: "Next run time" })
  @Expose()
  nextRunAt?: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
