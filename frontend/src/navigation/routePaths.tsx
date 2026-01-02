import AboutPage from '@app/pages/AboutPage/AboutPage'
import BotDetailPage from '@app/pages/BotDetailPage/BotDetailPage'
import ConfirmSubscribePage from '@app/pages/ConfirmSubscribePage/ConfirmSubscribePage'
import ContactUsPage from '@app/pages/ContactUsPage/ContactUsPage'
import HomePage from '@app/pages/HomePage/HomePage'
import LoginPage from '@app/pages/LoginPage/LoginPage'
import { LoginRedirectPage } from '@app/pages/LoginRedirectPage'
import NewBotPage from '@app/pages/NewBotPage/NewBotPage'
import NotFoundPage from '@app/pages/NotFoundPage/NotFoundPage'
import ProfilePage from '@app/pages/ProfilePage/ProfilePage'
import SettingPage from '@app/pages/ProfilePage/SettingPage'
import GalleryPage from '@app/pages/ProfilePage/GalleryPage'
import SearchPage from '@app/pages/SearchPage/SearchPage'
import TermsPage from '@app/pages/TermsPage/TermsPage'
import UnsubscribePage from '@app/pages/UnsubscribePage/UnsubscribePage'
import { RoutePath } from '@app/types/RoutePath.types'
import OnboardingPage from '@app/pages/OnboardingPage/OnboardingPage'
import BotWizardPage from '@app/pages/BotWizardPage/BotWizardPage'

export const routePaths: RoutePath[] = [
  {
    index: true,
    path: '/',
    element: <HomePage />,
    strLabel: 'nav.home',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: '/welcome',
    element: <OnboardingPage />,
    strLabel: 'nav.welcome',
    isShowMenu: false,
    requireAuth: true,
  },
  {
    index: false,
    path: 'callbacks',
    element: <LoginRedirectPage />,
    strLabel: 'nav.login_redirect',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/bot/:botId',
    element: <BotDetailPage />,
    strLabel: '{{botName}}',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/about',
    element: <AboutPage></AboutPage>,
    strLabel: 'nav.about',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: '/profile',
    element: <ProfilePage></ProfilePage>,
    strLabel: 'nav.my_profile',
    isShowMenu: false,
    requireAuth: true
  },
  {
    index: false,
    path: '/profile/setting',
    element: <SettingPage></SettingPage>,
    strLabel: 'nav.personal_settings',
    isShowMenu: false,
    requireAuth: true,
  },
  {
    index: false,
    path: '/profile/gallery',
    element: <GalleryPage />,
    strLabel: 'nav.my_media_gallery',
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
    strLabel: 'nav.search',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '/terms',
    element: <TermsPage></TermsPage>,
    strLabel: 'nav.terms',
    isShowMenu: true,
    requireAuth: false,
  },
  {
    index: false,
    path: '',
    strLabel: 'nav.help',
    isShowMenu: true,
    requireAuth: false,
    children: [
      {
        strLabel:'nav.how_to_use',
        isExternal: true,
        path: '/how-to-use',
        element: undefined,
      },
      {
        strLabel: 'nav.contact_us',
        element: <ContactUsPage />,
        isExternal: false,
        path: '/contact-us',
      },
    ]
  },
  {
    index: false,
    path: '/bot-wizard',
    element: <BotWizardPage />,
    strLabel: 'nav.bot_wizard',
    isShowMenu: true,
    requireAuth: true,
  },
  {
    index: false,
    path: '/bot-wizard/new',
    element: <BotWizardPage />,
    strLabel: 'nav.bot_wizard',
    isShowMenu: false,
    requireAuth: true,
  },
  {
    index: false,
    path: 'new-bot',
    element: <NewBotPage></NewBotPage>,
    strLabel: 'nav.new_bot',
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
    strLabel: 'nav.login',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: 'confirm-subscribe',
    element: <ConfirmSubscribePage />,
    strLabel: 'nav.confirm_subscription',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: 'unsubscribe',
    element: <UnsubscribePage />,
    strLabel: 'nav.unsubscription',
    isShowMenu: false,
    requireAuth: false,
  },
  {
    index: false,
    path: '*',
    element: <NotFoundPage />,
    strLabel: 'nav.not_found',
    isShowMenu: false,
    requireAuth: false,
  }
]
