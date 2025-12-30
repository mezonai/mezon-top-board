import { MenuOutlined, UserOutlined } from '@ant-design/icons'
import logo from '@app/assets/images/topLogo.png'
import Button from '@app/mtb-ui/Button'
import { renderMenu } from '@app/navigation/router'
import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import { redirectToOAuth } from '@app/utils/auth'
import { removeAccessTokens } from '@app/utils/storage'
import { Drawer } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import MtbTypography from '../Typography/Typography'
import { cn } from '@app/utils/cn'
import styles from './Header.module.scss'
import { useAuth } from '@app/hook/useAuth'
import { AppEvent } from '@app/enums/AppEvent.enum'
import DropdownMenu from '@app/mtb-ui/Header/DropdownMenu'
import { getUrlMedia } from '@app/utils/stringHelper'
import avatar from '@app/assets/images/default-user.webp'
import HeaderBackground from './HeaderBackground'
import { useTranslation } from 'react-i18next'

function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false) 
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const { isLogin, postLogout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const imgUrl = userInfo?.profileImage ? getUrlMedia(userInfo.profileImage) : avatar
  const {t} = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogin = useCallback(() => redirectToOAuth(), [])
  const handleLogout = () => {
    setDropdownOpen(false)
    removeAccessTokens()
    postLogout()
    navigate('/')
    window.scrollTo(0, 0)
  }

  const handleSyncMezon = () => {
    handleLogout()
    handleLogin()
  }

  useEffect(() => {
    // window.addEventListener(AppEvent.LOGOUT, handleLogout)
    window.addEventListener(AppEvent.SYNC_MEZON, handleSyncMezon)

    return () => {
      // window.removeEventListener(AppEvent.LOGOUT, handleLogout)
      window.removeEventListener(AppEvent.SYNC_MEZON, handleSyncMezon)
    }
  }, [])

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (event.persisted || navigationEntry?.type === "back_forward") {
        window.location.reload()
      }
    }

    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [])

  const renderUserIcon = (size: string) => (
    <div className="relative select-none flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
      <div className="relative" onClick={() => setDropdownOpen((prev) => !prev)}>
        {isLogin ? (
          <img
            src={imgUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-accent-primary/50 transition-transform hover:scale-105"
          />
        ) : (
          <span className={cn(`rounded-full px-2 py-1 hover:bg-accent-primary/20 cursor-pointer transition-base text-${size}`)}>
            <UserOutlined />
          </span>)}

        {dropdownOpen && (
          <div ref={dropdownRef} className="absolute top-full right-0 mt-4 z-50">
            <DropdownMenu isLogin={isLogin} handleLogout={handleLogout} />
          </div>
        )}
      </div>

      {!isLogin && (
        <Button color="primary" variant="solid" size="large" block onClick={handleLogin}>
          {t('header.login')}
        </Button>
      )}
    </div>
  )

  const renderHeaderItems = (isUserIcon: boolean) => {
    return (
      <>
        <ul className="flex flex-col lg:flex-row gap-5 flex-none text-body mb-2 lg:mb-0">
          {renderMenu(true)}
        </ul>
        {isUserIcon && renderUserIcon('[20px]')}
      </>
    )
  }

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className={cn(
        'flex-between sticky top-0 w-full z-20',
        'bg-transparent', 
        'transition-all duration-300 ease-in-out', 
        isScrolled 
          ? 'py-3 px-5 lg:px-20 shadow-lg shadow-accent-primary/5' 
          : 'py-5 px-5 lg:px-20' 
      )}
    >
      <HeaderBackground isScrolled={isScrolled} />
      <div className='flex items-center gap-3 relative z-10 transition-transform duration-300' onClick={handleLogoClick}>
        <div className={cn('transition-all duration-300', isScrolled ? 'h-[40px]' : 'h-[50px]')}>
          <img src={logo} alt='' style={{ height: '100%', objectFit: 'contain' }} />
        </div>
        <MtbTypography variant='h5' customClassName='!mb-0 dark:text-white' label='Mezon Top Board' />
      </div>
      <div className={cn('flex-between gap-12.5 max-lg:hidden max-2xl:hidden relative z-10')}>
        {renderHeaderItems(true)}
      </div>
      <div className="2xl:hidden flex items-center gap-4 relative z-10">
        {renderUserIcon('xl')}

        <MenuOutlined
          className="text-xl cursor-pointer hover:text-accent-primary transition-base"
          onClick={() => setOpen(true)}
        />
      </div>
      <Drawer
        className={styles['custom-drawer']}
        zIndex={9999}
        title={
          <MtbTypography variant='h4' customClassName='!mb-0' label={t('header.menu_title')} />
        }
        placement='right'
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        styles={{
          body: { background: 'var(--bg-container)', color: 'var(--text-primary)' },
          header: { background: 'var(--bg-container)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
          content: { background: 'var(--bg-container)', color: 'var(--text-primary)' }
        }}
      >
        {renderHeaderItems(false)}
      </Drawer>
    </div>
  )
}

export default Header