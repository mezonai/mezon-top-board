import { App } from "@app/services/api/mezonApp/mezonApp.types";

export type TagBase = {
  id: string
  name: string
  slug: string
}

export type Tag = TagBase & {
  apps: App[]
}
