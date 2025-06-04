import { Link } from '@app/services/api/mezonApp/mezonApp.types'

export type LinkTypeBase = {
  id: string
  name: string
  prefixUrl: string
  icon: string
}

export type LinkType = LinkTypeBase & {
  links: Link[]
}
