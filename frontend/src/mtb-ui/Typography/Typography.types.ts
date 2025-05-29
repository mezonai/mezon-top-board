import { TypographyVariant, TypographyWeight, TypographyStyle } from '@app/enums/typography.enum'
import { Typography } from 'antd'
import { CSSProperties, ReactNode } from 'react'

export interface MtbTypographyProps {
  variant?: `${TypographyVariant}`
  children?: ReactNode
  label?: ReactNode
  position?: 'left' | 'right'
  weight?: `${TypographyWeight}`
  textStyle?: TypographyStyle[]
  customClassName?: string
  size?: number
  style?: CSSProperties
  ellipsis?: boolean
}

export type AntdTypographyComponent = typeof Typography.Title | typeof Typography.Text

export type levelTitle = 1 | 2 | 3 | 4 | 5