import { routePaths } from '@app/navigation/routePaths'
import { RootState } from '@app/store'
import { useAppSelector } from '@app/store/hook'
import { IMezonAppStore } from '@app/store/mezonApp'
import { IUserStore } from '@app/store/user'
import { RoutePath } from '@app/types/RoutePath.types'
import { fillHbsFormat } from '@app/utils/stringHelper'
import { getRouteMatchPath } from '@app/utils/uri'
import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useWebTitle = () => {
  const { t } = useTranslation(['common'])
  const location = useLocation()
  const { publicProfile } = useAppSelector<RootState, IUserStore>((s) => s.user)
  const { mezonAppDetail } = useSelector<RootState, IMezonAppStore>((s) => s.mezonApp)
  const flattenedRoutes = useMemo<RoutePath[]>(() => {
    const flatten = (routes: RoutePath[]): RoutePath[] =>
      routes.flatMap((r) => [
        r,
        ...(r.children ? flatten(r.children) : []),
      ])

    return flatten(routePaths)
  }, [])

  const routePath = getRouteMatchPath(flattenedRoutes.map((e) => ({ path: e.path })) || [], location.pathname)
  const route = flattenedRoutes.find((route) => route.path === routePath);

  const path = location.pathname.split('/').filter((i) => i)
  let pageName = route?.strLabel ? t(route.strLabel) : (path[path.length - 1] || 'Home')

  const updateTitle = useCallback(() => {
    pageName = fillHbsFormat(pageName, {
      userName: publicProfile?.name || 'User',
      botName: mezonAppDetail?.name || 'Bot',
    })
    document.title = `${pageName} - Mezon Top Board`
  }, [location.pathname, publicProfile?.name, mezonAppDetail?.name, t])

  useEffect(() => {
    updateTitle()
  }, [location.pathname, publicProfile?.name, mezonAppDetail?.name, t])
}

export default useWebTitle
