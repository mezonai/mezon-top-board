import { EButtonColor, EButtonVariant } from "@app/enums/button.enum"
import { ButtonProps } from "antd"
import { ReactNode } from "react"

export interface IButtonProps extends Omit<ButtonProps, "color" | "variant"> {
  color?: `${EButtonColor}`
  variant?: `${EButtonVariant}`
  customClassName?: string
  children?: ReactNode
}
