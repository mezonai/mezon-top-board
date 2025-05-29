import { Progress } from 'antd'
import { CSSProperties } from 'react'
import styles from './ProgressBar.module.scss'
import { IMtbProgressProps } from './ProgressBar.types'

function MtbProgress({ borderRadius, backgroundStrokeColor, customClassName, ...props }: IMtbProgressProps) {
  return (
    <div
      className={`${styles['mtb-progress']} w-full ${customClassName}`}
      style={
        {
          '--progress-border-radius': borderRadius ? `${borderRadius}px` : '100px',
          '--progress-background-stroke-color': backgroundStrokeColor ?? '#00000007'
        } as CSSProperties
      }
    >
      <Progress {...props}></Progress>
    </div>
  )
}

export default MtbProgress
