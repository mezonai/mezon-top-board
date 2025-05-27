import { EButtonColor, EButtonVariant } from "@app/enums/button.enum"

export interface IButtonProps {
  color?: `${EButtonColor}`
  variant?: `${EButtonVariant}`
  customClassName?: string
}
