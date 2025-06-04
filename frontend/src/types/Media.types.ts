import { User } from "./User.types"

export type MediaFileBase = {
  id: string
  fileName: string
  mimeType?: string | null
  filePath?: string | null
  ownerId?: string | null
}

export type MediaFile = MediaFileBase & {
  owner: User
}
