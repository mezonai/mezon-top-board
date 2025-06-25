import { RateProps } from 'antd'

export interface IMtbRateProps extends RateProps {
  readonly?: boolean
  color?: string
  size?: number
  isShowTooltip?: boolean
  customClassName?: string
}
