import { Rate } from 'antd'
import styles from './Rate.module.scss'
import { CSSProperties } from 'react'
import { IMtbRateProps } from './Rate.types'
import { cn } from '@app/utils/cn'

function MtbRate({ readonly = false, color, size, isShowTooltip = false, customClassName = '', ...props }: IMtbRateProps) {
  const isReadOnly = readonly ? (props?.value ?? undefined) : undefined
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']

  const cssVars = {
    '--rate-color': color ?? '#fadb14',
    '--rate-size': typeof size === 'number' ? `${size}px` : size ?? '20px'
  } as unknown as CSSProperties

  return (
    <div className={cn(styles['mtb-rate'], customClassName)} style={cssVars}>
      <Rate {...props} tooltips={isShowTooltip ? desc : []} defaultValue={isReadOnly} disabled={readonly} />
    </div>
  )
}

export default MtbRate
