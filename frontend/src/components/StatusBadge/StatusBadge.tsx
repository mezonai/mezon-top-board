import React from 'react'
import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { AppStatus } from '@app/enums/AppStatus.enum'

interface StatusBadgeProps {
  status?: AppStatus
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation('common')

  if (status === undefined || status === null) return <Tag className={className}>-</Tag>

  const labelMap: Record<number, string> = {
    [AppStatus.PUBLISHED]: t('status.published'),
    [AppStatus.APPROVED]: t('status.approved'),
    [AppStatus.PENDING]: t('status.pending'),
    [AppStatus.REJECTED]: t('status.rejected'),
  }
  const label = labelMap[status] ?? t('status.unknown')

  let color: string | undefined
  switch (status) {
    case AppStatus.PUBLISHED:
      color = 'green'
      break
    case AppStatus.APPROVED:
      color = 'blue'
      break
    case AppStatus.PENDING:
      color = 'orange'
      break
    case AppStatus.REJECTED:
      color = 'red'
      break
    default:
      color = undefined
  }

  return <Tag className={className} color={color}>{label}</Tag>
}

export default StatusBadge
