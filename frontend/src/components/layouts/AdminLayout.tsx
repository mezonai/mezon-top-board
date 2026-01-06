import logo from '@app/assets/images/topLogo.png'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { adminRoutePaths } from '@app/navigation/adminRoutePaths'
import { Breadcrumb, Layout, Menu } from 'antd'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.scss'; // Import the styles
import { useEffect } from 'react'
import useAdminCheck from '@app/hook/useAdminCheck'
import { useTheme } from '@app/hook/useTheme'

const { Header, Footer, Sider, Content } = Layout

function AdminLayout() {
  document.title = 'Management - Mezon Top Board'
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)
  const { theme } = useTheme()

  // const { checkAdmin } = useAdminCheck()
  // useAuthRedirect()
  // useEffect(() => {
  //   checkAdmin()
  // }, [])

  return (
    <Layout className={styles['admin-layout']}>
      <Sider width={250} className={styles.sider} theme={theme}>
        <div className={styles['logo-container']}>
          <img src={logo} alt='MTB Logo' />
          <span className={styles['logo-text']}>MTB Admin</span>
        </div>
        
        <div className={styles['menu-label']}>MENU</div>

        <Menu mode='vertical' defaultSelectedKeys={['/admin']} selectedKeys={[location.pathname]}>
          {adminRoutePaths.filter((route) => route.isShowMenu).map((route) => (
            <Menu.Item key={route.path} icon={route.icon}>
              <NavLink to={route.path}>{route.label || route.strLabel}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.breadcrumbContainer}>
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
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>Footer</Footer>
      </Layout>
    </Layout >
  )
}

export default AdminLayout
