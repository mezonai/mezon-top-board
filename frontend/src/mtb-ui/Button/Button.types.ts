import { EButtonColor, EButtonVariant } from "@app/enums/button.enum"
import { ButtonProps } from "antd"
import { ReactNode } from "react"

export interface IButtonProps extends Omit<ButtonProps, "color" | "variant"> {
  color?: EButtonColor | `${EButtonColor}` | string
  variant?: EButtonVariant | `${EButtonVariant}` | string
  customClassName?: string
  children?: ReactNode
}
