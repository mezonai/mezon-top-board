import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'

interface BaseProps {
  className?: string
}

interface TypeTagProps extends BaseProps {
  kind: 'type'
  value?: MezonAppType
}

interface PricingTagProps extends BaseProps {
  kind: 'pricing'
  value?: AppPricing
}

export type TagPillProps = TypeTagProps | PricingTagProps