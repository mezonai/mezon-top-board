import logo from '@app/assets/images/topLogo.png'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { adminRoutePaths } from '@app/navigation/adminRoutePaths'
import { Breadcrumb, Layout, Menu } from 'antd'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.scss'; // Import the styles
import { useEffect } from 'react'
import useAdminCheck from '@app/hook/useAdminCheck'
import { useTheme } from '@app/hook/useTheme'
import { cn } from '@app/utils/cn'

const { Header, Footer, Sider, Content } = Layout

function AdminLayout() {
  document.title = 'Management - Mezon Top Board'
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)
  const { theme } = useTheme()

  const { checkAdmin } = useAdminCheck()
  useAuthRedirect()
  useEffect(() => {
    checkAdmin()
  }, [])

  return (
    <Layout className="h-screen bg-body overflow-hidden">
      <Sider
        width={250}
        theme={theme}
        className={cn(
          'py-5 h-screen sticky top-0 left-0 overflow-y-auto',
          'border-r border-border !bg-sidebar text-sidebar',
          styles.sider
        )}
      >
        <div className="flex items-center px-5 mb-7 gap-2">
          <img src={logo} alt='MTB Logo' className="h-8 w-auto" />
          <span className="text-sidebar text-lg font-bold tracking-tight">MTB Admin</span>
        </div>
        
        <div className="px-5 mb-4 text-sidebar-label text-sm font-medium uppercase tracking-wider">MENU</div>

        <Menu mode='vertical' defaultSelectedKeys={['/admin']} selectedKeys={[location.pathname]}>
          {adminRoutePaths.filter((route) => route.isShowMenu).map((route) => (
            <Menu.Item key={route.path} icon={route.icon}>
              <NavLink to={route.path}>{route.label || route.strLabel}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="min-h-screen flex flex-col overflow-hidden">
        <Header
          className={cn(
            'flex items-center justify-start h-16 !px-5 flex-shrink-0',
            '!bg-container shadow-header',
            styles.header
          )}
        >
          <div className="flex-center">
            <Breadcrumb>
              {pathSnippets.map((snippet, index) => {
                const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
                return (
                  <Breadcrumb.Item key={url}>
                    <Link to={url}>{snippet.charAt(0).toUpperCase() + snippet.slice(1)}</Link>
                  </Breadcrumb.Item>
                )
              })}
            </Breadcrumb>
          </div>
        </Header>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="min-h-full flex flex-col">
            <Content className={cn('p-5 !bg-content flex-1', styles.content)}>
              <Outlet />
            </Content>
            <Footer className="text-center !bg-container !text-secondary py-5 px-12 border-t border-border-footer">
              Footer
            </Footer>
          </div>
        </div>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
