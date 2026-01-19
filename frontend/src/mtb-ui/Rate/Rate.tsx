import { Rate } from 'antd'
import styles from './Rate.module.scss'
import { CSSProperties } from 'react'
import { IMtbRateProps } from './Rate.types'
import { cn } from '@app/utils/cn'

function MtbRate({ readonly = false, color, size = 'middle', isShowTooltip = false, customClassName = '', ...props }: IMtbRateProps) {
  const isReadOnly = readonly ? (props?.value ?? undefined) : undefined
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']

  const sizeConfig = {
    small: {
      size: '16px',
      gap: '2px'
    },
    middle: {
      size: '20px',
      gap: '8px'
    },
  }

  const currentConfig = sizeConfig[size] || sizeConfig.middle

  const cssVars = {
    '--rate-color': color ?? '#fadb14',
    '--rate-size': currentConfig.size,
    '--rate-gap': currentConfig.gap,
  } as unknown as CSSProperties

  return (
    <div className={cn(styles['mtb-rate'], customClassName)} style={cssVars}>
      <Rate {...props} tooltips={isShowTooltip ? desc : []} defaultValue={isReadOnly} disabled={readonly} />
    </div>
  )
}

export default MtbRate