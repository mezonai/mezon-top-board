import { App } from "./App.types"
import { User } from "./User.types"

export type AppReviewHistoryBase = {
  appId: string
  isApproved: boolean
  reviewerId: string
  reviewedAt: string
  remark: string
}

export type AppReviewHistory = AppReviewHistoryBase & {
  app: App
  reviewer: Omit<User, 'password' | 'apps'>
} 