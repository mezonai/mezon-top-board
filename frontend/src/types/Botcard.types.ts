import { GetMezonAppDetailsResponse, GetRelatedMezonAppResponse } from '@app/services/api/mezonApp/mezonApp'

export interface IBotCardProps {
  readonly?: boolean
  data?: GetMezonAppDetailsResponse
  isNavigate?: boolean
}

export interface ICompactBotCardProps {
  data?: GetRelatedMezonAppResponse
  isPublic?: boolean
}

export interface IAddBotFormProps {
  isEdit: boolean
}
