import { RateProps } from 'antd'

export interface IMtbRateProps extends RateProps {
  readonly?: boolean
  color?: string
  size?: 'small' | 'middle'
  isShowTooltip?: boolean
  customClassName?: string
}