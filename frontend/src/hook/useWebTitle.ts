import { routePaths } from '@app/navigation/routePaths'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IMezonAppStore } from '@app/store/mezonApp'
import { IUserStore } from '@app/store/user'
import { RoutePath } from '@app/types/RoutePath.types'
import { fillHbsFormat } from '@app/utils/stringHelper'
import { getRouteMatchPath } from '@app/utils/uri'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const flattenRoutes = (routes: RoutePath[]): RoutePath[] =>
  routes.flatMap((r) => [
    r,
    ...(r.children ? flattenRoutes(r.children) : []),
  ])

const useWebTitle = () => {
  const location = useLocation()
  const { publicProfile } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)

  const flatRoutes = useMemo(() => flattenRoutes(routePaths), [])

  const routePath = getRouteMatchPath(
    flatRoutes.map((r) => ({ path: r.path })),
    location.pathname
  )

  const route = flatRoutes.find((r) => r.path === routePath)

  const pageName = useMemo(() => {
    const path = location.pathname.split('/').filter(Boolean)
    return route?.strLabel || path[path.length - 1] || 'Home'
  }, [route, location.pathname])

  useEffect(() => {
    const title = fillHbsFormat(pageName, {
      userName: publicProfile?.name || 'User',
      botName: mezonAppDetail?.name || 'Bot',
    })

    document.title = `${title} - Mezon Top Board`
  }, [pageName, publicProfile?.name, mezonAppDetail?.name])
}

export default useWebTitle
