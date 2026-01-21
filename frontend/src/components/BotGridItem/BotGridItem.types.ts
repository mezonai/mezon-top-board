import { GetRelatedMezonAppResponse } from "@app/services/api/mezonApp/mezonApp.types"

export interface IBotGridItemProps {
  data?: GetRelatedMezonAppResponse
  isPublic?: boolean
  onRefresh?: () => void
  minimal?: boolean;
}