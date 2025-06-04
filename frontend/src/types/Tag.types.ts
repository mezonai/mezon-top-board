import { App } from "./App.types"

export type TagBase = {
  id: string
  name: string
  slug: string
}

export type Tag = TagBase & {
  apps: App[]
}
