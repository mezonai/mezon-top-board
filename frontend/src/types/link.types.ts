import { App, User } from "@app/types"

export type LinkType = {
    id: string
    name: string
    prefixUrl: string
    icon: string
    links: Link[]
    createdAt: Date
    updatedAt: Date
}

export type Link = {
    id: string
    url: string
    ownerId: string
    showOnProfile: boolean
    linkTypeId: string
    type: LinkType
    apps: App[]
    owner: User
    createdAt: Date
    updatedAt: Date
}