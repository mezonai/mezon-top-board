import { ReactNode, HTMLAttributes, CSSProperties } from "react"

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  style?: CSSProperties
  hoverEffect?: boolean
}