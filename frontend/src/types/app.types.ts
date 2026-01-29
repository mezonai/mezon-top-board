import { MezonAppType } from "@app/enums/mezonAppType.enum"
import { Tag, Link, AppReviewHistory, Rating, User, AppVersion } from '@app/types'
import { BaseApp } from "./baseApp.types"

export type App = BaseApp & {
    ownerId: string
    currentVersion: number
    currentVersionChangelog?: string
    currentVersionUpdatedAt?: Date
    hasNewUpdate: boolean
    mezonAppId: string
    type: MezonAppType
    tags: Tag[]
    socialLinks: Link[]
    reviewHistories: AppReviewHistory[]
    ratings: Rating[]
    owner: User
    versions: AppVersion[]
}