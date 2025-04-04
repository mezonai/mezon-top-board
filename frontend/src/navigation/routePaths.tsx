import AboutPage from '@app/pages/AboutPage/AboutPage'
import BotDetailPage from '@app/pages/BotDetailPage/BotDetailPage'
import HelpPage from '@app/pages/HelpPage/HelpPage'
import HomePage from '@app/pages/HomePage/HomePage'
import LoginPage from '@app/pages/LoginPage/LoginPage'
import { LoginRedirectPage } from '@app/pages/LoginRedirectPage'
import NewBotPage from '@app/pages/NewBotPage/NewBotPage'
import NotFoundPage from '@app/pages/NotFoundPage/NotFoundPage'
import ProfilePage from '@app/pages/ProfilePage/ProfilePage'
import SettingPage from '@app/pages/ProfilePage/SettingPage'
import SearchPage from '@app/pages/SearchPage/SearchPage'
import TermsPage from '@app/pages/TermsPage/TermsPage'
import { RoutePath } from '@app/types/RoutePath.types'

export const routePaths: RoutePath[] = [
  {
    index: true,
    path: '/',
    element: <HomePage />,
    strLabel: 'Home',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: 'callbacks',
    element: <LoginRedirectPage />,
    strLabel: 'Login Redirect',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/:botId',
    element: <BotDetailPage />,
    strLabel: '{{botName}}',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/about',
    element: <AboutPage></AboutPage>,
    strLabel: 'About',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: '/profile',
    element: <ProfilePage></ProfilePage>,
    strLabel: 'My Profile',
    isShowMenu: true,
    requireAuth: true
  },
  {
    index: false,
    path: '/profile/setting',
    element: <SettingPage></SettingPage>,
    strLabel: 'Personal Settings',
    isShowMenu: false,
    requireAuth: true,
  },
  {
    index: false,
    path: '/profile/:userId',
    element: <ProfilePage></ProfilePage>,
    strLabel: '{{userName}}',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/search',
    element: <SearchPage></SearchPage>,
    strLabel: 'Search',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/terms',
    element: <TermsPage></TermsPage>,
    strLabel: 'Terms',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: '/help',
    element: <HelpPage></HelpPage>,
    strLabel: 'Help',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: 'new-bot',
    element: <NewBotPage></NewBotPage>,
    strLabel: 'New Bot',
    isShowMenu: false,
    requireAuth: true,
  },
  {
    index: false,
    path: '/new-bot/:botId',
    element: <NewBotPage></NewBotPage>,
    strLabel: '',
    isShowMenu: false,
    requireAuth: true,
  },
  {
    index: false,
    path: 'login',
    element: <LoginPage />,
    strLabel: 'Login',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '*',
    element: <NotFoundPage />,
    strLabel: 'Not Found',
    isShowMenu: false,
    requireAuth: false,
  }
]
