import { GetMezonAppDetailsResponse } from "@app/services/api/mezonApp/mezonApp.types"

export interface IBotListItemProps {
  readonly?: boolean
  data?: GetMezonAppDetailsResponse
  canNavigateOnClick?: boolean
}

export interface IAddBotFormProps {
  isEdit: boolean
}
