import React from 'react'
import { cn } from '@app/utils/cn'

interface BadgeStatusProps {
  status: string
  color?: string
  className?: string
}

const colorMap: Record<string, string> = {
  red: 'bg-danger',
  orange: 'bg-warning',
  blue: 'bg-info',
  green: 'bg-success',
  gray: 'bg-muted',
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, color, className }) => {
  const bgClass = color ? colorMap[color] || colorMap.gray : colorMap.gray

  return (
    <div className={cn('absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10', className)}>
      <span
        className={cn(
          'absolute block w-48 py-1 top-4 -right-6',
          'text-[9px] font-bold uppercase tracking-wider text-center text-white',
          '-rotate-45 shadow-sm',
          bgClass
        )}
      >
        {status}
      </span>
    </div>
  )
}

export default BadgeStatus