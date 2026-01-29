import { AppStatus } from "@app/enums/AppStatus.enum"
import { AppPricing } from "@app/enums/appPricing"

export type BaseApp = {
    id: string
    name: string
    status: AppStatus
    isAutoPublished: boolean
    headline: string
    description: string
    prefix: string
    featuredImage: string
    supportUrl: string
    changelog?: string
    pricingTag: AppPricing
    price: number | null
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}