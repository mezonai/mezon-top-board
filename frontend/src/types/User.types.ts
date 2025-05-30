import { Role } from "@app/enums/Role.enum"
import { App, Link, Media } from "@app/services/api/mezonApp/mezonApp.types"
import { Rating } from "@app/services/api/rating/rating.types"

export type User = {
  id: string
  name: string
  email: string
  password: string | null
  role: Role
  bio: string | null
  ratings: Rating[]
  apps: App[]
  links: Link[]
  medias: Media[]
  profileImage: string | null
}
