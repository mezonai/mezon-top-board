import React from 'react'
import { Tag } from 'antd'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import { TagPillProps } from './TagPill.types'

const getLabel = (value?: string | number) => {
  if (value === undefined || value === null) return '-'
  return String(value).toUpperCase()
}

const getClassName = (value?: MezonAppType | AppPricing) => {
  const baseClass = '!bg-bg-container dark:!bg-bg-secondary !border'
  switch (value) {
    case MezonAppType.BOT:
      return `${baseClass} !border-primary-default !text-primary-default`
    case MezonAppType.APP:
      return `${baseClass} !border-sky-500 !text-sky-500 dark:!border-sky-400 dark:!text-sky-400`
    case AppPricing.FREE:
      return `${baseClass} !border-green-500 !text-green-500 dark:!border-green-400 dark:!text-green-400`
    case AppPricing.PAID:
      return `${baseClass} !border-purple-500 !text-purple-500 dark:!border-purple-400 dark:!text-purple-400`
    default:
      return `${baseClass} !border-gray-300 !text-gray-500 dark:!border-gray-600 dark:!text-gray-400`
  }
}

const TagPill: React.FC<TagPillProps> = ({ value, className = '' }) => {
  const cls = getClassName(value)

  return (
    <Tag className={`${cls} ${className} uppercase`}>
      {getLabel(value)}
    </Tag>
  )
}

export default TagPill
