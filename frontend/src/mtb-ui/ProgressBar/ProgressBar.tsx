import { Progress } from 'antd'
import { CSSProperties } from 'react'
import styles from './ProgressBar.module.scss'
import { IMtbProgressProps } from './ProgressBar.types'
import { cn } from '@app/utils/cn'

function MtbProgress({ borderRadius, backgroundStrokeColor, customClassName, ...props }: IMtbProgressProps) {
  const cssVars = {
    '--progress-border-radius': borderRadius ? `${borderRadius}px` : '100px',
    '--progress-background-stroke-color': backgroundStrokeColor ?? '#00000007'
  } as unknown as CSSProperties

  return (
    <div className={cn(styles['mtb-progress'], 'w-full', customClassName)} style={cssVars}>
      <Progress {...props}></Progress>
    </div>
  )
}

export default MtbProgress
