import { AppStatus } from "@app/enums/AppStatus.enum"
import { AppLanguage } from "@app/enums/appLanguage.enum"
import { AppPricing } from "@app/enums/appPricing"

export type BaseApp = {
    id: string
    status: AppStatus
    isAutoPublished: boolean
    prefix: string
    featuredImage: string
    supportUrl: string
    changelog?: string
    pricingTag: AppPricing
    price: number | null
    defaultLanguage: AppLanguage
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}