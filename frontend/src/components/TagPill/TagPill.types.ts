import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'

export interface TagPillProps {
    className?: string
    value?: MezonAppType | AppPricing
}