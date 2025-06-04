import { Role } from "@app/enums/Role.enum"
import { Link } from "@app/services/api/mezonApp/mezonApp.types"
import { App } from "./App.types"
import { Rating } from "./Rating.types"
import { MediaFile } from "./Media.types"

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
  medias: MediaFile[]
  profileImage: string | null
}
