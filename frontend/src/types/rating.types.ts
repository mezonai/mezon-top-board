import { App, User } from '@app/types'

export type Rating = {
    id: string
    appId: string
    userId: string
    score: number
    comment: string
    user: User
    app: App
    createdAt: Date
    updatedAt: Date
}