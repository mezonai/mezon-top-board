import { User } from '@app/types'

export type Media = {
    is: string
    fileName: string
    mimeType: string
    filePath: string
    ownerId: string
    owner: User
    createdAt: Date
    updatedAt: Date
}