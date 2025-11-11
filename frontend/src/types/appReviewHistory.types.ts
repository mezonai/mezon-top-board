import { App, AppVersion, User } from '@app/types'

export type AppReviewHistory = {
    id: string
    appId: string
    appVersionId: string
    isApproved: boolean
    reviewerId: string
    reviewedAt: Date
    remark: string
    app: App
    appVersion: AppVersion
    reviewer: User
    createdAt: Date
    updatedAt: Date
}