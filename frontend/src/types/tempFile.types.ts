import { User } from '@app/types'

export type TempFile = {
    id: string
    fileName: string
    mimeType: string
    filePath: string
    expiredAt: Date
    ownerId: string
    owner: User
    createdAt: Date
    updatedAt: Date
}