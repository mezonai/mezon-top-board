import { Role } from "@app/enums/role.enum"
import { Rating, App, Link, Media } from "@app/types"

export type User = {
    id: string
    name: string
    email: string
    role: Role
    bio: string
    profileImage: string
    willSyncFromMezon: boolean
    isFirstLogin: boolean
    ratings: Rating[]
    apps: App[]
    links: Link[]
    medias: Media[]
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}