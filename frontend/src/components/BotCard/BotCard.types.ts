import { GetMezonAppDetailsResponse, GetRelatedMezonAppResponse } from "@app/services/api/mezonApp/mezonApp.types"

export interface IBotCardProps {
  readonly?: boolean
  data?: GetMezonAppDetailsResponse
  canNavigateOnClick?: boolean
}

export interface ICompactBotCardProps {
  data?: GetRelatedMezonAppResponse
  isPublic?: boolean
  isDragging?: boolean
}

export interface IAddBotFormProps {
  isEdit: boolean
}
