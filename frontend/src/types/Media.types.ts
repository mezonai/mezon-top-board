import { User } from "./User.types"

export type MediaFileBase = {
  id: string
  fileName: string
  mimeType: string
  filePath: string
  ownerId: string
}

export type MediaFile = MediaFileBase & {
  owner: User
}
 