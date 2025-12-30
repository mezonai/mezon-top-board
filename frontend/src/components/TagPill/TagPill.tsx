import React from 'react'
import { Tag } from 'antd'
import { MezonAppType } from '@app/enums/mezonAppType.enum'
import { AppPricing } from '@app/enums/appPricing'
import { TagPillProps } from './TagPill.types'
import { cn } from '@app/utils/cn'
import { useTranslation } from 'react-i18next'

const getLabel = (value?: string | number, t?: any) => {
  if (value === undefined || value === null) return '-'
  
  if (Object.values(MezonAppType).includes(value as MezonAppType)) {
      return t(`enums.mezon_app_type.${String(value).toUpperCase()}`)
  }
  if (Object.values(AppPricing).includes(value as AppPricing)) {
      return t(`enums.app_pricing.${value}`)
  }

  return String(value).toUpperCase()
}

const getClassName = (value?: MezonAppType | AppPricing) => {
  const baseClass = "bg-container dark:bg-secondary border font-medium"

  switch (value) {
    case MezonAppType.BOT:
      return cn(baseClass, "!border-red-400 !text-red-400 dark:border-red-400 dark:text-red-400")
    case MezonAppType.APP:
      return cn(baseClass, "!border-sky-500 !text-sky-500 dark:border-sky-400 dark:text-sky-400")
    case AppPricing.FREE:
      return cn(baseClass, "!border-green-500 !text-green-500 dark:border-green-500 dark:text-green-500")
    case AppPricing.PAID:
      return cn(baseClass, "!border-purple-500 !text-purple-500 dark:border-purple-400 dark:text-purple-400")
    default:
      return cn(baseClass, "!border-border !text-secondary")
  }
}

const TagPill: React.FC<TagPillProps> = ({ value, className = '' }) => {
  const { t } = useTranslation()
  const variantClass = getClassName(value)

  return (
    <Tag 
      className={cn(
        "uppercase rounded-md px-2 py-0.5", 
        variantClass, 
        className
      )}
    >
      {getLabel(value, t)}
    </Tag>
  )
}

export default TagPill