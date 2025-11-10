import React from 'react'
import { Tag } from 'antd'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import { TagPillProps } from './TagPill.types'

const getClassNameForType = (type?: MezonAppType) =>
  type === MezonAppType.BOT
    ? '!border-primary-hover !text-primary-hover !bg-white'
    : '!border-sky-500 !text-sky-500 !bg-white'

const getClassNameForPricing = (pricing?: AppPricing) =>
  pricing === AppPricing.FREE
    ? '!border-green-500 !text-green-500 !bg-white'
    : '!border-purple-500 !text-purple-500 !bg-white'

const getLabel = (value?: string | number) => {
  if (value === undefined || value === null) return '-'
  return String(value).toUpperCase()
}

const TagPill: React.FC<TagPillProps> = ({ kind, value, className = '' }) => {
  const cls = kind === 'type' ? getClassNameForType(value) : getClassNameForPricing(value)

  return (
    <Tag className={`${cls} ${className} uppercase`}>
      {getLabel(value)}
    </Tag>
  )
}

export default TagPill
