import { App, Tag, Link, AppReviewHistory } from '@app/types'
import { BaseApp } from './baseApp.types'

export type AppVersion = BaseApp & {
    appId: string
    version: number
    changelog?: string
    app: App
    tags: Tag[]
    socialLinks: Link[]
    reviewHistories: AppReviewHistory[]
}