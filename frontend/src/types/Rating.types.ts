import { App } from "./App.types"
import { User } from "./User.types"

export type RatingBase = {
  id: string
  score: number
  comment: string
  updatedAt: string
}

export type Rating = RatingBase & {
  user: Pick<User, "id" | "name" | "profileImage">
  app: App
}
