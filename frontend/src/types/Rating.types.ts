import { App } from "@app/services/api/mezonApp/mezonApp.types"
import { User } from "./User.types"

export type RatingBase = {
  id: string
  score: number
  comment: string | null
  updatedAt: string
}

export type Rating = RatingBase & {
  user: Pick<User, "id" | "name" | "profileImage">
  app: App
}
