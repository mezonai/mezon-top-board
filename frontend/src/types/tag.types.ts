import { App } from '@app/types'

export type Tag = {
    id: string
    name: string
    slug: string
    apps: App[]
    createdAt: Date
    updatedAt: Date
}