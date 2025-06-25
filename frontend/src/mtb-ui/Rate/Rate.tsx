import { Rate } from 'antd'
import styles from './Rate.module.scss'
import { CSSProperties } from 'react'
import { IMtbRateProps } from './Rate.types'

function MtbRate({ readonly = false, color, size, isShowTooltip = false, customClassName = '', ...props }: IMtbRateProps) {
  const isReadOnly = readonly ? (props?.value ?? undefined) : undefined
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
  return (
    <div
      className={`${styles['mtb-rate']} ${customClassName}`}
      style={
        {
          '--rate-color': color ?? '#fadb14',
          '--rate-size': `${size ?? 20}px`
        } as CSSProperties
      }
    >
      <Rate {...props} tooltips={isShowTooltip ? desc : []} defaultValue={isReadOnly} disabled={readonly} />
    </div>
  )
}

export default MtbRate
