import { GetRelatedMezonAppResponse } from "@app/services/api/mezonApp/mezonApp.types"
import { ItemVariant } from '@app/enums/ItemVariant.enum';

export interface IBotGridItemProps {
  data?: GetRelatedMezonAppResponse
  isPublic?: boolean
  onRefresh?: () => void
  variant?: ItemVariant
}