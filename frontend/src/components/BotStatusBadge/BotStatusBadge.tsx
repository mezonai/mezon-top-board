import React from 'react'
import { cn } from '@app/utils/cn'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['common'])

  return (
    <div className={cn('absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10', className)}>
      <span
        className={cn(
          'absolute block w-48 py-1 top-4 -right-6',
          'text-[8px] font-bold uppercase tracking-wider text-center text-white',
          '-rotate-45 shadow-sm',
          bgClass
        )}
      >
        {t(`status.${status}`)}
      </span>
    </div>
  )
}

export default BadgeStatus