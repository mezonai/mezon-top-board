import logo from '@app/assets/images/topLogo.png'
import useAuthRedirect from '@app/hook/useAuthRedirect'
import { adminRoutePaths } from '@app/navigation/adminRoutePaths'
import { Breadcrumb, Layout, Menu } from 'antd'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.scss'; // Import the styles
import MtbTypography from '@app/mtb-ui/Typography/Typography'
import { useEffect } from 'react'
import useAdminCheck from '@app/hook/useAdminCheck'
const { Header, Footer, Sider, Content } = Layout

function AdminLayout() {
  document.title = 'Management - Mezon Top Board'
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)

  const { checkAdmin } = useAdminCheck()
  useAuthRedirect()
  useEffect(() => {
    checkAdmin()
  }, [])

  return (
    <Layout className={styles['admin-layout']}>
      <Sider width={250} className={styles.sider}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '0px' }}>
          <div className='h-[30px]'>
            <img src={logo} alt='' style={{ height: '100%', objectFit: 'contain' }} />
          </div>
          <MtbTypography variant='p' style={{ color: '#fff' }} weight='bold'>
            MTB Management
          </MtbTypography>
        </div>
        <div className={styles['sider-divider']} />
        <Menu theme='dark' mode='vertical' defaultSelectedKeys={['/admin']} selectedKeys={[location.pathname]}>
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
            <Breadcrumb style={{ color: '#fff' }}>
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
