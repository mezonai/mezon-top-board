import { Link, Status } from "@app/services/api/mezonApp/mezonApp.types"
import { Tag } from "./Tag.types"
import { AppReviewHistory } from "./AppReviewHistory.types"
import { Rating } from "./Rating.types"
import { User } from "./User.types"

export type App = {
  id?: string
  name: string
  ownerId: string
  status: Status
  isAutoPublished: boolean
  installLink: string
  headline: string
  description: string
  prefix: string
  featuredImage: string
  supportUrl: string
  remark: string
  tags: Tag[]
  socialLinks: Link[]
  reviewHistories: AppReviewHistory[]
  ratings: Rating[]
  owner: User
}