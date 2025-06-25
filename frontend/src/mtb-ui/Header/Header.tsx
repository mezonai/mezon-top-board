import { DownOutlined, MenuOutlined } from '@ant-design/icons'
import logo from '@app/assets/images/topLogo.png'
import Button from '@app/mtb-ui/Button'
import { renderMenu } from '@app/navigation/router'
import { RootState } from '@app/store'
import { IUserStore } from '@app/store/user'
import { redirectToOAuth } from '@app/utils/auth'
import { removeAccessTokens } from '@app/utils/storage'
import { Drawer, Dropdown, MenuProps, Space } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import MtbTypography from '../Typography/Typography'
import styles from './Header.module.scss'
import { useAuth } from '@app/hook/useAuth'
import { AppEvent } from '@app/enums/AppEvent.enum'

function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  // const { theme, setTheme } = useTheme()
  const { userInfo } = useSelector<RootState, IUserStore>((s) => s.user)
  const { isLogin, postLogout } = useAuth()

  const handleLogin = useCallback(() => redirectToOAuth(), [])
  const handleLogout = () => {
    removeAccessTokens()
    postLogout()
    navigate('/')
    window.scrollTo(0, 0)
  }

  const handleSyncMezon = () => {
    handleLogout()
    handleLogin()
  }

  const itemsDropdown: MenuProps['items'] = [
    {
      key: '1',
      label: 'Logout',
      onClick: handleLogout
    }
  ]

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

  const renderHeaderItems = () => {
    return (
      <>
        {/* <div className={`flex items-center ${styles['custom-switch']}`}>
          <Switch
            checked={theme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            className='!align-middle'
          />
        </div> */}
        <ul className='flex flex-col lg:flex-row gap-5 flex-none text-sm mb-2'>{renderMenu(true)}</ul>
        <div className='flex flex-col lg:flex-row gap-3 mt-5 lg:mt-0 w-full'>
          {isLogin ? (
            <Dropdown
              menu={{ items: itemsDropdown }}
              className={`z-2 !text-black text-sm pb-2 lg:pb-0 transition-all duration-300 border-b-3 border-b-transparent max-w-xs`}
            >
              <a onClick={(e) => e.preventDefault()} className=''>
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                  <span>Welcome, </span>
                  <span className='break-words max-w-3/4'>{userInfo?.name}</span>
                  <DownOutlined />
                </div>
              </a>
            </Dropdown>
          ) : (
            <Button color='primary' variant='outlined' size='large' block onClick={handleLogin}>
              Log in
            </Button>
          )}
        </div>
      </>
    )
  }

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className={`flex bg-white z-2 items-center justify-between py-4 px-5 lg:px-20 border-t-1 border-b-1 border-gray-200 cursor-pointer sticky top-0`}
    >
      <div className='flex items-center gap-3' onClick={handleLogoClick}>
        <div className='h-[50px]'>
          <img src={logo} alt='' style={{ height: '100%', objectFit: 'contain' }} />
        </div>
        <MtbTypography variant='h5' customClassName='!mb-0'>
          Mezon Top Board
        </MtbTypography>
      </div>
      <div className='flex items-center justify-between gap-12.5 max-lg:hidden max-2xl:hidden'>
        {renderHeaderItems()}
      </div>
      <div className='2xl:hidden'>
        <MenuOutlined className='text-xl cursor-pointer' onClick={() => setOpen(true)} />
      </div>
      <Drawer
        className={styles['custom-drawer']}
        zIndex={9999}
        title={
          <MtbTypography variant='h4' customClassName='!mb-0'>
            Menu
          </MtbTypography>
        }
        placement='right'
        onClose={() => setOpen(false)}
        open={open}
        width={400}
      >
        {renderHeaderItems()}
      </Drawer>
    </div>
  )
}

export default Header
