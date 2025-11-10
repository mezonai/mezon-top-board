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
    switch (value) {
      case MezonAppType.BOT:
        return '!border-primary-hover !text-primary-hover !bg-white'
      case MezonAppType.APP:
        return '!border-sky-500 !text-sky-500 !bg-white'
      case AppPricing.FREE:
        return '!border-green-500 !text-green-500 !bg-white'
      case AppPricing.PAID:
        return '!border-purple-500 !text-purple-500 !bg-white'
      default:
        return '!border-gray-300 !text-gray-500 !bg-white'
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
