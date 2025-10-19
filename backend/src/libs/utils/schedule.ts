// src/features/subscribe/utils/schedule.utils.ts
import { BadGatewayException } from '@nestjs/common'

import { addDays, addWeeks, addMonths, addYears } from 'date-fns'

import { RepeatUnit } from '@domain/common/enum/subscribeTypes'

export function getNextSendTime(
  lastSentAt: Date,
  repeatEvery: number,
  repeatUnit: RepeatUnit
): Date {
  switch (repeatUnit) {
    case RepeatUnit.DAY:
      return addDays(lastSentAt, repeatEvery)
    case RepeatUnit.WEEK:
      return addWeeks(lastSentAt, repeatEvery)
    case RepeatUnit.MONTH:
      return addMonths(lastSentAt, repeatEvery)
    case RepeatUnit.YEAR:
      return addYears(lastSentAt, repeatEvery)
    default:
      throw new BadGatewayException('Invalid repeat unit')
  }
}
