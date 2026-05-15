import React from 'react'
import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { cn } from '@app/utils/cn'
import { getStatusConfig } from '@app/utils/mezonApp'
import { AppStatus } from '@app/enums/AppStatus.enum'

interface BotStatusBadgeProps {
  status: AppStatus
  variant?: 'tag' | 'ribbon'
  className?: string
}

const BotStatusBadge: React.FC<BotStatusBadgeProps> = ({ 
  status, 
  variant = 'tag', 
  className 
}) => {
  const { t } = useTranslation('common')
  const { color, labelKey, tailwindBg } = getStatusConfig(status)
  const label = t(labelKey)

  if (variant === 'ribbon') {
    return (
      <div className={cn('absolute top-0 left-0 w-24 h-24 overflow-hidden pointer-events-none z-10', className)}>
        <span
          className={cn(
            'absolute block w-48 py-1 top-4 -right-6',
            'text-[8px] font-bold uppercase tracking-wider text-center text-white',
            '-rotate-45 shadow-sm',
            tailwindBg
          )}
        >
          {label}
        </span>
      </div>
    )
  }

  return (
    <Tag color={color} className={cn('m-0', className)}>
      {label}
    </Tag>
  )
}

export default BotStatusBadge